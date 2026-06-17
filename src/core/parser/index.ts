import type { ParsedFile } from '../../types'
import { parseDocx } from './docxParser'
import { parsePdf } from './pdfParser'

/**
 * 统一文件解析入口
 * 根据文件类型分发到对应的解析器
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  const ext = file.name.split('.').pop()?.toLowerCase()

  let markdown: string

  switch (ext) {
    case 'docx':
      markdown = await parseDocx(file)
      break
    case 'pdf':
      markdown = await parsePdf(file)
      break
    default:
      throw new Error(
        `不支持的文件格式: ${ext}。请上传 .docx 或 .pdf 文件。`
      )
  }

  return {
    markdown,
    fileName: file.name,
  }
}
