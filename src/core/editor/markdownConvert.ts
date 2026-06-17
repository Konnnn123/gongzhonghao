/**
 * 轻量 Markdown → HTML 转换器
 * 生成 TipTap 兼容的干净 HTML
 * 根据当前 H2/H3 样式设置，为标题添加 data 属性
 */
export function markdownToHtml(markdown: string, h2Style?: string, h3Style?: string): string {
  const lines = markdown.split('\n')
  const htmlParts: string[] = []
  let inCodeBlock = false
  let codeContent = ''
  let inList = false
  let listType: 'ul' | 'ol' = 'ul'

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        htmlParts.push(`<pre><code>${escapeHtml(codeContent.trimEnd())}</code></pre>`)
        codeContent = ''
        inCodeBlock = false
      } else {
        inCodeBlock = true
      }
      continue
    }
    if (inCodeBlock) { codeContent += line + '\n'; continue }

    const trimmed = line.trim()
    if (!trimmed) {
      if (inList) { htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false }
      continue
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const content = processInline(headingMatch[2])
      const dataAttr = level === 2 && h2Style ? ` data-h2-style="${h2Style}"` : level === 3 && h3Style ? ` data-h3-style="${h3Style}"` : ''
      htmlParts.push(`<h${level}${dataAttr}>${content}</h${level}>`)
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) { htmlParts.push('<hr>'); continue }

    if (/^[-*+]\s+/.test(trimmed)) {
      if (!inList || listType !== 'ul') { if (inList) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); htmlParts.push('<ul>'); inList = true; listType = 'ul' }
      htmlParts.push(`<li>${processInline(trimmed.replace(/^[-*+]\s+/, ''))}</li>`)
      continue
    }
    if (/^\d+[.)]\s+/.test(trimmed)) {
      if (!inList || listType !== 'ol') { if (inList) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); htmlParts.push('<ol>'); inList = true; listType = 'ol' }
      htmlParts.push(`<li>${processInline(trimmed.replace(/^\d+[.)]\s+/, ''))}</li>`)
      continue
    }

    if (inList) { htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>'); inList = false }

    if (trimmed.startsWith('>')) { htmlParts.push(`<blockquote><p>${processInline(trimmed.replace(/^>\s*/, ''))}</p></blockquote>`); continue }
    if (/^!\[([^\]]*)\]\(([^)]+)\)$/.test(trimmed)) { const m = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)!; htmlParts.push(`<img src="${m[2]}" alt="${escapeHtml(m[1])}">`); continue }

    htmlParts.push(`<p>${processInline(trimmed)}</p>`)
  }

  if (inList) htmlParts.push(listType === 'ul' ? '</ul>' : '</ol>')
  if (inCodeBlock) htmlParts.push(`<pre><code>${escapeHtml(codeContent)}</code></pre>`)
  return htmlParts.join('\n')
}

function processInline(text: string): string {
  let r = text
  r = r.replace(/`([^`]+)`/g, '<code>$1</code>')
  r = r.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
  r = r.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  r = r.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  r = r.replace(/__(.+?)__/g, '<strong>$1</strong>')
  r = r.replace(/\*(.+?)\*/g, '<em>$1</em>')
  r = r.replace(/_(.+?)_/g, '<em>$1</em>')
  r = r.replace(/==(.*?)==/g, '<mark>$1</mark>')
  return r
}

function escapeHtml(t: string): string { return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') }

export function htmlToMarkdown(html: string): string {
  let md = html
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
  md = md.replace(/\n{3,}/g, '\n\n')
  return md.trim()
}
