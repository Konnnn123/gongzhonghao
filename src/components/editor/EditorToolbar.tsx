import { useState, useRef, useEffect } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Quote, Minus, ImagePlus, Undo2, Redo2, Highlighter,
  Palette, Type, Table,
} from 'lucide-react'
import type { Editor } from '@tiptap/react'
import { useEditorStore } from '../../store/useEditorStore'
import { deriveThemeConfig } from '../../core/themes/themeConfigs'

interface Props { editor: Editor | null }

const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24, 28, 32]
const COLORS = [
  '#333333', '#666666', '#999999',
  '#1e80ff', '#0958d9', '#ff6a00',
  '#f53f3f', '#00b42a', '#722ed1',
  '#86909c', '#c41d7f', '#d4380d',
]

export function EditorToolbar({ editor }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const colorInputRef = useRef<HTMLInputElement>(null)
  const { addImage, typography } = useEditorStore()
  const [showFontSize, setShowFontSize] = useState(false)
  const [showColors, setShowColors] = useState(false)
  const fontSizeRef = useRef<HTMLDivElement>(null)
  const colorRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fontSizeRef.current && !fontSizeRef.current.contains(e.target as Node)) setShowFontSize(false)
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) setShowColors(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!editor) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { alert('图片大小不能超过 5MB'); return }
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result as string
      addImage(`img-${Date.now()}`, base64)
      editor.chain().focus().setImage({ src: base64, alt: file.name }).run()
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  /** 给选中文字设置内联样式 */
  const setSelectionStyle = (cssText: string) => {
    const { from, to } = editor.state.selection
    if (from === to) return // 没有选中文字
    // 获取选中内容的 HTML，包裹 style 属性后替换
    const selectedHtml = editor.state.doc.textBetween(from, to, '\n')
    editor.chain().focus().deleteSelection().insertContent(
      `<span style="${cssText}">${selectedHtml}</span>`
    ).run()
  }

  /** 设置选中文字颜色（内联 style） */
  const setTextColor = (color: string) => {
    setSelectionStyle(`color: ${color}`)
    setShowColors(false)
  }

  /** 设置选中文字字号（内联 style） */
  const setFontSize = (size: number) => {
    setSelectionStyle(`font-size: ${size}px`)
    setShowFontSize(false)
  }

  const btn = (active: boolean, disabled = false) =>
    `p-1.5 rounded transition-colors ${
      active ? 'bg-brand text-white'
        : disabled ? 'text-gray-300 cursor-not-allowed'
        : 'text-text-secondary hover:bg-surface-secondary'
    }`

  return (
    <div className="flex items-center gap-0.5 px-3 py-1.5 border-b border-border bg-surface flex-wrap">
      {/* 撤销/重做 */}
      <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btn(false, !editor.can().undo())}>
        <Undo2 className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btn(false, !editor.can().redo())}>
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* 标题 */}
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}>
        <Heading1 className="w-4 h-4" />
      </button>
      <button onClick={() => {
        const { h2Style, typography } = useEditorStore.getState()
        ;(editor.chain().focus() as any).setWeChatHeading({ headingLevel: 2, themeStyle: h2Style, brandColor: typography.brandColor }).run()
      }} className={btn(editor.isActive('wechatHeading', { headingLevel: 2 }))}>
        <Heading2 className="w-4 h-4" />
      </button>
      <button onClick={() => {
        const { h3Style, typography } = useEditorStore.getState()
        ;(editor.chain().focus() as any).setWeChatHeading({ headingLevel: 3, themeStyle: h3Style, brandColor: typography.brandColor }).run()
      }} className={btn(editor.isActive('wechatHeading', { headingLevel: 3 }))}>
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* 文字样式 */}
      <button onClick={() => {
        const { brandColor } = useEditorStore.getState().typography
        const theme = deriveThemeConfig(brandColor)
        ;(editor.chain().focus() as any).toggleBold({ color: theme.headingColor }).run()
      }} className={btn(editor.isActive('wechatBold'))}>
        <Bold className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
        <Italic className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))}>
        <UnderlineIcon className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}>
        <Strikethrough className="w-4 h-4" />
      </button>
      <button onClick={() => {
        const { brandColor } = useEditorStore.getState().typography
        const theme = deriveThemeConfig(brandColor)
        ;(editor.chain().focus() as any).toggleHighlight({ color: theme.highlightBg, textColor: theme.highlightText }).run()
      }} className={btn(editor.isActive('weChatHighlight'))}>
        <Highlighter className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* 字号选择器 */}
      <div className="relative" ref={fontSizeRef}>
        <button
          onClick={() => { setShowFontSize(!showFontSize); setShowColors(false) }}
          className="flex items-center gap-0.5 px-1.5 py-1 rounded text-xs text-text-secondary hover:bg-surface-secondary transition-colors"
          title="设置选中文字字号"
        >
          <Type className="w-3.5 h-3.5" />
          <span className="text-[10px]">字号</span>
        </button>
        {showFontSize && (
          <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 p-2 grid grid-cols-4 gap-1 w-44">
            {FONT_SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setFontSize(s)}
                className="px-2 py-1 text-xs rounded hover:bg-brand hover:text-white transition-colors text-center"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 文字颜色选择器 */}
      <div className="relative" ref={colorRef}>
        <button
          onClick={() => { setShowColors(!showColors); setShowFontSize(false) }}
          className="flex items-center gap-0.5 px-1.5 py-1 rounded text-xs text-text-secondary hover:bg-surface-secondary transition-colors"
          title="设置选中文字颜色"
        >
          <Palette className="w-3.5 h-3.5" />
          <div className="w-3 h-3 rounded-sm border border-border" style={{ background: typography.brandColor }} />
        </button>
        {showColors && (
          <div className="absolute top-full left-0 mt-1 bg-surface border border-border rounded-lg shadow-lg z-50 p-2 w-40">
            <div className="grid grid-cols-6 gap-1 mb-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setTextColor(c)}
                  className="w-5 h-5 rounded-sm border border-border hover:scale-125 transition-transform"
                  style={{ background: c }}
                  title={c}
                />
              ))}
            </div>
            {/* 自定义颜色 */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-border">
              <input
                ref={colorInputRef}
                type="color"
                defaultValue={typography.brandColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-5 h-5 cursor-pointer border-0 p-0"
              />
              <span className="text-[10px] text-text-muted">自定义</span>
            </div>
          </div>
        )}
      </div>

      <div className="w-px h-5 bg-border mx-1" />

      {/* 列表 */}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>
        <List className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>
        <ListOrdered className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>
        <Quote className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      {/* 对齐 */}
      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))}>
        <AlignLeft className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))}>
        <AlignCenter className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))}>
        <AlignRight className="w-4 h-4" />
      </button>

      <div className="w-px h-5 bg-border mx-1" />

      <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btn(false)}>
        <Minus className="w-4 h-4" />
      </button>
      <button onClick={() => fileInputRef.current?.click()} className={btn(false)}>
        <ImagePlus className="w-4 h-4" />
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btn(false)} title="插入表格">
        <Table className="w-4 h-4" />
      </button>
    </div>
  )
}
