import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import TiptapImage from '@tiptap/extension-image'
import { useEditorStore } from '../../store/useEditorStore'
import { markdownToHtml } from '../../core/editor/markdownConvert'
import { WeChatHeading } from '../../core/extensions/WeChatHeading'
import { WeChatHighlight, syncHighlightColor } from '../../core/extensions/WeChatHighlight'
import { convertHeadingsToWeChat } from '../../core/extensions/convertToWeChat'
import {
  WeChatParagraph, WeChatBulletList, WeChatOrderedList,
  WeChatListItem, WeChatBlockquote, WeChatHorizontalRule,
} from '../../core/extensions/WeChatBaseTags'
import { deriveThemeConfig } from '../../core/themes/themeConfigs'
import { EditorToolbar } from './EditorToolbar'

/** 应用主题到整个文档：标题 + 高亮 + 段落样式 */
function applyThemeToDocument(editor: any) {
  if (!editor?.view) return
  const { h2Style, h3Style, typography } = useEditorStore.getState()
  const theme = deriveThemeConfig(typography.brandColor)
  const { state, view } = editor
  const tr = state.tr
  let modified = false

  state.doc.descendants((node: any, pos: number) => {
    // 1. 更新 WeChatHeading
    if (node.type.name === 'wechatHeading') {
      const newThemeStyle = node.attrs.headingLevel === 2 ? h2Style : h3Style
      if (node.attrs.brandColor !== theme.headingColor || node.attrs.themeStyle !== newThemeStyle) {
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          brandColor: theme.headingColor,
          themeStyle: newThemeStyle,
        })
        modified = true
      }
    }

    // 2. 更新 WeChatParagraph 属性（字号/行高/段间距）
    if (node.type.name === 'paragraph') {
      const fs = `${typography.fontSize}px`
      const lh = String(typography.lineHeight)
      const mb = `${typography.paragraphSpacing}px`
      if (node.attrs.fontSize !== fs || node.attrs.lineHeight !== lh || node.attrs.marginBottom !== mb) {
        tr.setNodeMarkup(pos, undefined, { ...node.attrs, fontSize: fs, lineHeight: lh, marginBottom: mb })
        modified = true
      }
    }

    // 3. 更新 WeChatHighlight 标记
    if (node.marks) {
      const markType = state.schema.marks.weChatHighlight
      if (markType) {
        for (const mark of node.marks) {
          if (mark.type.name === 'wechatHighlight' && mark.attrs.color !== theme.highlightBg) {
            tr.removeMark(pos, pos + node.nodeSize, mark)
            tr.addMark(pos, pos + node.nodeSize, markType.create({ color: theme.highlightBg }))
            modified = true
          }
        }
      }
    }
  })

  if (modified) view.dispatch(tr)
}

async function loadMd(editor: any, md: string, retries = 3): Promise<boolean> {
  const { h2Style, h3Style, typography } = useEditorStore.getState()
  for (let i = 0; i < retries; i++) {
    if (editor && !editor.isDestroyed && editor.isEditable) {
      try {
        const rawHtml = markdownToHtml(md)
        const wxHtml = convertHeadingsToWeChat(rawHtml, h2Style, h3Style, typography.brandColor)
        editor.commands.setContent(wxHtml, false)
        return true
      } catch (e) { console.error(`[TipTap] load #${i + 1}:`, e) }
    }
    await new Promise(r => setTimeout(r, 200))
  }
  return false
}

export function TipTapEditor() {
  const { markdown, typography, h2Style, h3Style } = useEditorStore()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1] },
        underline: false, highlight: false,
        paragraph: false, bulletList: false, orderedList: false,
        listItem: false, blockquote: false, horizontalRule: false,
      }),
      WeChatParagraph,
      WeChatBulletList, WeChatOrderedList, WeChatListItem,
      WeChatBlockquote, WeChatHorizontalRule,
      WeChatHeading,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph', 'wechatHeading'] }),
      WeChatHighlight.configure({ multicolor: true }),
      TextStyle, Color,
      TiptapImage.configure({ inline: false, allowBase64: true }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none min-h-full p-6',
        style: `font-size:${typography.fontSize}px;line-height:${typography.lineHeight};color:#333;font-family:${typography.fontFamily};`,
      },
    },
  })

  useEffect(() => {
    if (editor) (window as any).__tiptapEditor = editor
    return () => { delete (window as any).__tiptapEditor }
  }, [editor])

  // 加载 markdown
  useEffect(() => {
    if (!editor || !markdown) return
    let cancelled = false
    loadMd(editor, markdown).then(ok => {
      if (!cancelled && ok) {
        console.log('[TipTap] loaded')
        setTimeout(() => applyThemeToDocument(editor), 50)
      }
    })
    return () => { cancelled = true }
  }, [markdown, editor])

  // 主题/排版变化 → 同步
  useEffect(() => {
    if (!editor) return
    applyThemeToDocument(editor)
  }, [h2Style, h3Style, typography.brandColor, typography.fontSize, typography.lineHeight, typography.paragraphSpacing, editor])

  const bc = typography.brandColor

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto bg-surface">
        <div className="max-w-[580px] mx-auto py-6">
          <EditorContent editor={editor} />
        </div>
      </div>

      <style>{`
        .tiptap-editor h1{font-size:20px;font-weight:bold;text-align:center;border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:${bc};padding-bottom:8px;margin-top:28px;margin-bottom:16px;line-height:1.4;color:#1d2129;}
        .tiptap-editor strong{color:${bc};font-weight:700;}
        .tiptap-editor u{border-bottom-width:2px;border-bottom-style:solid;border-bottom-color:${bc};padding-bottom:1px;}
        .tiptap-editor img{max-width:100%;height:auto;border-radius:4px;margin-top:12px;margin-bottom:12px;}
        .tiptap-editor code{background-color:#f2f3f5;padding:2px 6px;border-radius:3px;font-size:13px;color:#c41d7f;}
        .tiptap-editor pre{background-color:#f7f8fa;border-width:1px;border-style:solid;border-color:#e5e6eb;border-radius:6px;padding:16px;margin-top:16px;margin-bottom:16px;overflow-x:auto;font-size:13px;line-height:1.6;}
        .tiptap-editor pre code{background-color:transparent;padding:0;color:#1d2129;}
      `}</style>
    </div>
  )
}
