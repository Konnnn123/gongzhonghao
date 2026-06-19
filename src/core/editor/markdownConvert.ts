/**
 * 轻量 Markdown → HTML 转换器
 * 支持：标题、段落、列表、代码块、表格、引用、分隔线、图片、链接
 */
export function markdownToHtml(markdown: string, h2Style?: string, h3Style?: string): string {
  const lines = markdown.split('\n')
  const htmlParts: string[] = []
  let inCodeBlock = false
  let codeContent = ''
  let inList = false
  let listType: 'ul' | 'ol' = 'ul'
  let inTable = false
  let tableRows: string[][] = []

  function flushTable() {
    if (!inTable || tableRows.length === 0) return
    // 检测分隔行（| --- | --- |）
    let headerIdx = -1
    for (let i = 0; i < tableRows.length; i++) {
      if (tableRows[i].every(cell => /^\s*[-:]+\s*$/.test(cell))) {
        headerIdx = i
        break
      }
    }
    const hasHeader = headerIdx >= 0
    // 表头是分隔行的上一行（分隔行本身不显示）
    const headerRow = hasHeader ? tableRows[headerIdx - 1] : null
    const dataRows = hasHeader
      ? tableRows.filter((_, i) => i !== headerIdx && i !== headerIdx - 1)
      : tableRows

    htmlParts.push('<table>')
    if (headerRow) {
      htmlParts.push('<thead>')
      htmlParts.push('<tr>')
      for (const cell of headerRow) {
        htmlParts.push(`<th>${processInline(cell.trim())}</th>`)
      }
      htmlParts.push('</tr>')
      htmlParts.push('</thead>')
    }
    htmlParts.push('<tbody>')
    const rowsToRender = headerRow ? dataRows : tableRows
    for (const row of rowsToRender) {
      htmlParts.push('<tr>')
      for (const cell of row) {
        htmlParts.push(`<td>${processInline(cell.trim())}</td>`)
      }
      htmlParts.push('</tr>')
    }
    htmlParts.push('</tbody>')
    htmlParts.push('</table>')
    tableRows = []
    inTable = false
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // 代码块
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        htmlParts.push(`<pre><code>${escapeHtml(codeContent.trimEnd())}</code></pre>`)
        codeContent = ''
        inCodeBlock = false
      } else {
        flushTable()
        if (inList) { htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false }
        inCodeBlock = true
      }
      continue
    }
    if (inCodeBlock) { codeContent += line + '\n'; continue }

    // 表格行
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!inTable) {
        flushTable()
        if (inList) { htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false }
        inTable = true
      }
      // 解析 | cell1 | cell2 | → ['cell1', 'cell2']
      const cells = trimmed.split('|').slice(1, -1) // 去掉首尾空元素
      tableRows.push(cells)
      continue
    } else if (inTable) {
      flushTable()
    }

    // 空行
    if (!trimmed) {
      if (inList) { htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false }
      continue
    }

    // 标题
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const content = processInline(headingMatch[2])
      const dataAttr = level === 2 && h2Style ? ` data-h2-style="${h2Style}"` : level === 3 && h3Style ? ` data-h3-style="${h3Style}"` : ''
      htmlParts.push(`<h${level}${dataAttr}>${content}</h${level}>`)
      continue
    }

    // 分隔线
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { htmlParts.push('<hr>'); continue }

    // 无序列表
    if (/^[-*+]\s+/.test(trimmed)) {
      if (!inList || listType !== 'ul') { if (inList) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); htmlParts.push('<ul>'); inList = true; listType = 'ul' }
      htmlParts.push(`<li>${processInline(trimmed.replace(/^[-*+]\s+/, ''))}</li>`)
      continue
    }
    // 有序列表
    if (/^\d+[.)]\s+/.test(trimmed)) {
      if (!inList || listType !== 'ol') { if (inList) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); htmlParts.push('<ol>'); inList = true; listType = 'ol' }
      htmlParts.push(`<li>${processInline(trimmed.replace(/^\d+[.)]\s+/, ''))}</li>`)
      continue
    }

    if (inList) { htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false }

    // 引用
    if (trimmed.startsWith('>')) {
      htmlParts.push(`<blockquote><p>${processInline(trimmed.replace(/^>\s*/, ''))}</p></blockquote>`)
      continue
    }
    // 图片
    if (/^!\[([^\]]*)\]\(([^)]+)\)$/.test(trimmed)) {
      const m = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)!
      htmlParts.push(`<img src="${m[2]}" alt="${escapeHtml(m[1])}">`)
      continue
    }

    // 原始 HTML 块（如 <section data-type="ai-summary">）直接保留，不包 <p>
    if (/^<\//.test(trimmed) || /^<(section|div|article|aside|header|footer|main|nav)[\s>]/i.test(trimmed)) {
      htmlParts.push(trimmed)
      continue
    }

    // 普通段落
    htmlParts.push(`<p>${processInline(trimmed)}</p>`)
  }

  if (inList) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>')
  if (inCodeBlock) htmlParts.push(`<pre><code>${escapeHtml(codeContent)}</code></pre>`)
  flushTable()
  return htmlParts.join('\n')
}

/** 需要保留的 HTML 标签（不被 strip） */
const PRESERVE_TAGS = ['section', 'strong', 'em', 'u', 'mark', 'ul', 'ol', 'li', 'p']

function processInline(text: string): string {
  let r = text
  // 先保护需要保留的 HTML 标签，用占位符替换
  const preserved: string[] = []
  r = r.replace(/<(\/?)(section|strong|em|u|mark|ul|ol|li|p)([^>]*)>/gi, (match) => {
    preserved.push(match)
    return `\x00PRESERVED_${preserved.length - 1}\x00`
  })
  // 正常 Markdown 内联转换
  r = r.replace(/`([^`]+)`/g, '<code>$1</code>')
  r = r.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
  r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  r = r.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  r = r.replace(/__(.+?)__/g, '<strong>$1</strong>')
  r = r.replace(/\*(.+?)\*/g, '<em>$1</em>')
  r = r.replace(/_(.+?)_/g, '<em>$1</em>')
  r = r.replace(/==(.*?)==/g, '<mark>$1</mark>')
  // 还原被保护的 HTML 标签
  r = r.replace(/\x00PRESERVED_(\d+)\x00/g, (_, i) => preserved[parseInt(i)])
  return r
}

function escapeHtml(t: string): string {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

export function htmlToMarkdown(html: string): string {
  let md = html
  // 先保护 <section> 块，防止后续正则误伤
  const sectionBlocks: string[] = []
  md = md.replace(/<section[\s\S]*?<\/section>/gi, (match) => {
    sectionBlocks.push(match)
    return `\x00SECTION_${sectionBlocks.length - 1}\x00`
  })
  md = md.replace(/<p[^>]*>/g, '\n').replace(/<\/p>/g, '\n')
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/g, '\n# $1\n')
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, '\n## $1\n')
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, '\n### $1\n')
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/g, '\n#### $1\n')
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/\1>/g, '**$2**')
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/\1>/g, '*$2*')
  md = md.replace(/<u>([\s\S]*?)<\/u>/g, '<u>$1</u>')
  md = md.replace(/<mark[^>]*>([\s\S]*?)<\/mark>/g, '<mark>$1</mark>')
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)')
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/g, '![]($1)')
  md = md.replace(/<img[^>]*>/g, '')
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, '[$2]($1)')
  md = md.replace(/<ul[^>]*>/g, '\n').replace(/<\/ul>/g, '\n')
  md = md.replace(/<ol[^>]*>/g, '\n').replace(/<\/ol>/g, '\n')
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, '- $1\n')
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/g, '> $1\n')
  md = md.replace(/<hr\s*\/?>/g, '\n---\n')
  md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```')
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/g, '`$1`')
  md = md.replace(/<[^>]+>/g, '')
  md = md.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&quot;/g, '"')
  // 还原 <section> 块
  md = md.replace(/\x00SECTION_(\d+)\x00/g, (_, i) => sectionBlocks[parseInt(i)])
  md = md.replace(/\n{3,}/g, '\n\n')
  return md.trim()
}
