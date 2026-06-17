import mammoth from 'mammoth'

/**
 * 解析 .docx 文件并转换为 Markdown
 * 使用 mammoth.js 提取 HTML，再清洗为 Markdown
 */
export async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      convertImage: mammoth.images.dataUri,
      styleMap: [
        "p[style-name='Heading 1'] => h1",
        "p[style-name='Heading 2'] => h2",
        "p[style-name='Heading 3'] => h3",
        "p[style-name='Title'] => h1",
        "p[style-name='Subtitle'] => h2",
      ],
    }
  )

  const html = result.value
  return htmlToMarkdown(html)
}

/**
 * 将 HTML 转换为 Markdown
 * 处理常见的 HTML 标签
 */
function htmlToMarkdown(html: string): string {
  let md = html

  // 标题
  md = md.replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
  md = md.replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
  md = md.replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
  md = md.replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
  md = md.replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
  md = md.replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')

  // 加粗和斜体
  md = md.replace(/<(strong|b)[^>]*>(.*?)<\/\1>/gi, '**$2**')
  md = md.replace(/<(em|i)[^>]*>(.*?)<\/\1>/gi, '*$2*')

  // 链接
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')

  // 图片
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)')
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)')

  // 列表
  md = md.replace(/<ul[^>]*>/gi, '\n')
  md = md.replace(/<\/ul>/gi, '\n')
  md = md.replace(/<ol[^>]*>/gi, '\n')
  md = md.replace(/<\/ol>/gi, '\n')
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')

  // 引用
  md = md.replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '> $1\n')

  // 代码
  md = md.replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
  md = md.replace(/<pre[^>]*>(.*?)<\/pre>/gi, '```\n$1\n```\n')

  // 段落和换行
  md = md.replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
  md = md.replace(/<br\s*\/?>/gi, '\n')
  md = md.replace(/<hr\s*\/?>/gi, '\n---\n')

  // 表格（简单处理）
  md = md.replace(/<table[^>]*>/gi, '\n')
  md = md.replace(/<\/table>/gi, '\n')
  md = md.replace(/<tr[^>]*>(.*?)<\/tr>/gi, '$1\n')
  md = md.replace(/<t[dh][^>]*>(.*?)<\/t[dh]>/gi, '| $1 ')

  // 移除剩余的 HTML 标签
  md = md.replace(/<[^>]+>/g, '')

  // HTML 实体解码
  md = md.replace(/&amp;/g, '&')
  md = md.replace(/&lt;/g, '<')
  md = md.replace(/&gt;/g, '>')
  md = md.replace(/&nbsp;/g, ' ')
  md = md.replace(/&quot;/g, '"')

  // 清理多余空行（最多保留两个换行）
  md = md.replace(/\n{3,}/g, '\n\n')

  return md.trim()
}
