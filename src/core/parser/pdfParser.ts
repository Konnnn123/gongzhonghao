import * as pdfjsLib from 'pdfjs-dist'

// 配置 pdf.js worker —— 使用 CDN 避免 Vite 路径解析问题
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

/**
 * 解析 PDF 文件并转换为 Markdown
 * 逐页提取文本，根据字体大小推断标题层级
 */
export async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const totalPages = pdf.numPages
  const textParts: string[] = []

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    // 按 Y 坐标分组文本行
    const lines = groupTextByLine(content.items as TextItem[])

    // 根据字体大小推断层级
    for (const line of lines) {
      const maxFontSize = Math.max(...line.map((item) => item.height))
      const text = line.map((item) => item.str).join('').trim()

      if (!text) continue

      if (maxFontSize >= 20) {
        textParts.push(`# ${text}\n`)
      } else if (maxFontSize >= 16) {
        textParts.push(`## ${text}\n`)
      } else if (maxFontSize >= 14) {
        textParts.push(`### ${text}\n`)
      } else {
        textParts.push(`${text}\n`)
      }
    }

    // 页面之间加分隔
    if (i < totalPages) {
      textParts.push('\n')
    }
  }

  return textParts.join('\n').trim()
}

interface TextItem {
  str: string
  height: number
  transform: number[]
}

/**
 * 按 Y 坐标将文本项分组为行
 */
function groupTextByLine(items: TextItem[]): TextItem[][] {
  if (items.length === 0) return []

  const sorted = [...items].sort((a, b) => b.transform[5] - a.transform[5])
  const lines: TextItem[][] = []
  let currentLine: TextItem[] = [sorted[0]]
  let currentY = sorted[0].transform[5]

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i]
    // 如果 Y 坐标差距小于行高的一半，认为是同一行
    if (Math.abs(item.transform[5] - currentY) < item.height * 0.5) {
      currentLine.push(item)
    } else {
      lines.push([...currentLine])
      currentLine = [item]
      currentY = item.transform[5]
    }
  }
  lines.push(currentLine)

  // 每行内按 X 坐标排序
  return lines.map((line) =>
    line.sort((a, b) => a.transform[4] - b.transform[4])
  )
}
