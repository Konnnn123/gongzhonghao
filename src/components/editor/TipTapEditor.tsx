import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { WeChatImage } from '../../core/extensions/WeChatImage'
import { useEditorStore } from '../../store/useEditorStore'
import { markdownToHtml } from '../../core/editor/markdownConvert'
import { WeChatHeading } from '../../core/extensions/WeChatHeading'
import { WeChatHighlight } from '../../core/extensions/WeChatHighlight'
import { WeChatBold } from '../../core/extensions/WeChatBold'
import { WeChatReference } from '../../core/extensions/WeChatReference'
import { Table as NativeTable } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { convertHeadingsToWeChat } from '../../core/extensions/convertToWeChat'
import {
  WeChatParagraph, WeChatBulletList, WeChatOrderedList,
  WeChatListItem, WeChatBlockquote, WeChatHorizontalRule,
} from '../../core/extensions/WeChatBaseTags'
import { deriveThemeConfig } from '../../core/themes/themeConfigs'
import { EditorToolbar } from './EditorToolbar'

/**
 * JSON 状态重构法 —— 废弃 tr 遍历，直接修改 JSON 树后 setContent
 * 绝对可靠：不依赖 ProseMirror Transaction API
 */
function syncGlobalState(editor: any) {
  if (!editor) return
  const { h2Style, h3Style, typography } = useEditorStore.getState()
  const theme = deriveThemeConfig(typography.brandColor)
  const json = editor.getJSON()

  // 记住光标
  const { from, to } = editor.state.selection

  // 递归修改 JSON 树
  const traverse = (node: any) => {
    // 段落 → 字号/行高/段间距
    if (node.type === 'paragraph') {
      node.attrs = {
        ...node.attrs,
        fontSize: `${typography.fontSize}px`,
        lineHeight: String(typography.lineHeight),
        marginBottom: `${typography.paragraphSpacing}px`,
      }
    }

    // 列表项 → 字号/行高
    if (node.type === 'listItem') {
      node.attrs = {
        ...node.attrs,
        fontSize: `${typography.fontSize}px`,
        lineHeight: String(typography.lineHeight),
      }
    }

    // 标题 → 品牌色 + 样式
    if (node.type === 'wechatHeading') {
      const level = node.attrs?.headingLevel || 2
      node.attrs = {
        ...node.attrs,
        brandColor: theme.headingColor,
        themeStyle: level === 2 ? h2Style : h3Style,
      }
    }

    // 标记 → 高亮 + 加粗颜色
    if (node.marks) {
      node.marks = node.marks.map((mark: any) => {
        if (mark.type === 'wechatHighlight') {
          return {
            ...mark,
            attrs: { color: theme.highlightBg, textColor: theme.highlightText },
          }
        }
        if (mark.type === 'wechatBold') {
          return {
            ...mark,
            attrs: { color: theme.headingColor },
          }
        }
        return mark
      })
    }

    // 递归
    if (node.content) {
      node.content.forEach(traverse)
    }
  }

  traverse(json)

  // 替换全量文档 + 恢复光标
  editor.commands.setContent(json, false)
  try {
    editor.commands.setTextSelection({ from: Math.min(from, editor.state.doc.content.size), to: Math.min(to, editor.state.doc.content.size) })
  } catch { /* 光标可能越界，忽略 */ }
}

async function loadMd(editor: any, md: string, retries = 3): Promise<boolean> {
  const { h2Style, h3Style, typography } = useEditorStore.getState()
  for (let i = 0; i < retries; i++) {
    if (editor && !editor.isDestroyed && editor.isEditable) {
      try {
        const rawHtml = markdownToHtml(md)
        console.log('[DEBUG] Markdown 源码前500字:', md.substring(0, 500))
        console.log('[DEBUG] 转换后 HTML 前500字:', rawHtml.substring(0, 500))
        const wxHtml = convertHeadingsToWeChat(rawHtml, h2Style, h3Style, typography.brandColor)
        console.log('[DEBUG] setContent 前 HTML 前500字:', wxHtml.substring(0, 500))
        editor.commands.setContent(wxHtml, false)
        console.log('[DEBUG] TipTap 渲染后 DOM 前500字:', editor.view.dom.innerHTML.substring(0, 500))
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
        bold: false, underline: false,
        paragraph: false, bulletList: false, orderedList: false,
        listItem: false, blockquote: false, horizontalRule: false,
      }),
      WeChatParagraph,
      WeChatBulletList, WeChatOrderedList, WeChatListItem,
      WeChatBlockquote, WeChatHorizontalRule,
      WeChatHeading,
      WeChatBold,
      WeChatReference,
      // 原生表格 — 零自定义，CSS 接管样式
      NativeTable.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph', 'wechatHeading'] }),
      WeChatHighlight.configure({ multicolor: true }),
      TextStyle, Color,
      WeChatImage.configure({ inline: false, allowBase64: true }),
    ],
    editorProps: {
      attributes: {
        class: 'tiptap-editor outline-none min-h-full p-6',
        style: `font-size:${typography.fontSize}px;line-height:${typography.lineHeight};color:#333;font-family:${typography.fontFamily};`,
      },
      // 粘贴过滤：清除 Word 的 mso- 冗余样式
      transformPastedHTML: (html: string) => {
        return html.replace(/mso-[^:]+:[^;]+;?/gi, '')
      },
      // 表格粘贴隔离：检测 HTML 内容，确保原生 TipTap 处理表格
      handlePaste: (_view: any, event: any, slice: any) => {
        // 检查 slice 中是否已有 table 节点
        if (slice.content.firstChild?.type?.name === 'table') {
          return false
        }
        // 检查剪贴板 HTML 中是否包含 table
        const html = event.clipboardData?.getData('text/html') || ''
        if (html.includes('<table')) {
          return false // 交给原生 TipTap 处理
        }
        return false
      },
    },
  })

  // 暴露编辑器
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
        setTimeout(() => syncGlobalState(editor), 50)
      }
    })
    return () => { cancelled = true }
  }, [markdown, editor])

  // 主题/排版变化 → JSON 重构
  useEffect(() => {
    if (!editor) return
    syncGlobalState(editor)
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
        .tiptap-editor table{display:table !important;width:100%;max-width:100%;margin:20px auto !important;border-collapse:collapse;table-layout:fixed;}
        .tiptap-editor td,.tiptap-editor th{min-width:1em;position:relative;}
        .tiptap-editor td p,.tiptap-editor th p{margin:0;}
      `}</style>
    </div>
  )
}
