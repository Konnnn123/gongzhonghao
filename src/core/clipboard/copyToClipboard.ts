import { useEditorStore } from '../../store/useEditorStore'

/**
 * 一键复制到微信公众号
 *
 * 核心原则：
 * 1. 使用 Clipboard API + text/html MIME
 * 2. 外层 <section> 包裹防止全局样式丢失
 * 3. 递归展开所有 CSS 简写属性（微信兼容）
 * 4. 不使用 <h1>-<h6> 标签（微信会重置样式）
 */
export async function copyToClipboard(): Promise<void> {
  const editor = (window as any).__tiptapEditor
  if (!editor) throw new Error('编辑器未就绪')

  const html = editor.getHTML()
  if (!html || html === '<p></p>') throw new Error('编辑器内容为空')

  const { typography: t } = useEditorStore.getState()

  // 解析 HTML → 递归展开简写 → 重新序列化
  const doc = new DOMParser().parseFromString(html, 'text/html')
  expandAllShorthand(doc.body)

  // 外层包裹：防止全局样式丢失（微信兜底）
  const finalHtml = `<section style="font-family: ${t.fontFamily}; font-size: ${t.fontSize}px; line-height: ${t.lineHeight}; color: #333333; letter-spacing: 0.05em; word-wrap: break-word;">${doc.body.innerHTML}</section>`

  // Clipboard API 写入
  const blob = new Blob([finalHtml], { type: 'text/html; charset=utf-8' })
  const item = new ClipboardItem({ 'text/html': blob })
  await navigator.clipboard.write([item])
}

/**
 * 递归展开所有 CSS 简写属性
 * 微信对 border-bottom、margin、padding 等简写解析有 bug
 */
function expandAllShorthand(el: Element) {
  if (el instanceof HTMLElement) {
    const style = el.getAttribute('style')
    if (style) {
      el.setAttribute('style', expandShorthand(style))
    }
  }
  for (const child of Array.from(el.children)) {
    expandAllShorthand(child)
  }
}

function expandShorthand(css: string): string {
  const parts = css.split(';').map(s => s.trim()).filter(Boolean)
  const expanded: string[] = []

  for (const part of parts) {
    const colonIdx = part.indexOf(':')
    if (colonIdx === -1) { expanded.push(part); continue }

    const prop = part.slice(0, colonIdx).trim()
    const val = part.slice(colonIdx + 1).trim()

    // margin: top right bottom left
    if (prop === 'margin') {
      const vals = val.split(/\s+/)
      expanded.push(`margin-top: ${vals[0] || '0'}`)
      expanded.push(`margin-right: ${vals[1] || vals[0] || '0'}`)
      expanded.push(`margin-bottom: ${vals[2] || vals[0] || '0'}`)
      expanded.push(`margin-left: ${vals[3] || vals[1] || vals[0] || '0'}`)
      continue
    }
    // padding: top right bottom left
    if (prop === 'padding') {
      const vals = val.split(/\s+/)
      expanded.push(`padding-top: ${vals[0] || '0'}`)
      expanded.push(`padding-right: ${vals[1] || vals[0] || '0'}`)
      expanded.push(`padding-bottom: ${vals[2] || vals[0] || '0'}`)
      expanded.push(`padding-left: ${vals[3] || vals[1] || vals[0] || '0'}`)
      continue
    }
    // border: width style color
    if (prop === 'border' || prop === 'border-top' || prop === 'border-bottom' || prop === 'border-left' || prop === 'border-right') {
      const prefix = prop === 'border' ? 'border' : prop
      const vals = val.split(/\s+/)
      const width = vals.find(v => /^\d/.test(v)) || '1px'
      const style_ = vals.find(v => /^(solid|dashed|dotted|none)$/.test(v)) || 'solid'
      const color = vals.find(v => !/^\d/.test(v) && !/^(solid|dashed|dotted|none)$/.test(v)) || '#000000'
      expanded.push(`${prefix}-width: ${width}`)
      expanded.push(`${prefix}-style: ${style_}`)
      expanded.push(`${prefix}-color: ${color}`)
      continue
    }
    // background → background-color
    if (prop === 'background' && !val.includes('gradient')) {
      expanded.push(`background-color: ${val}`)
      continue
    }
    // font-size / font-weight / font-style 保持原样
    expanded.push(part)
  }

  return expanded.join('; ') + ';'
}
