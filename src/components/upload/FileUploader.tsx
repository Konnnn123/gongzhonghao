import { useCallback, useRef, useState } from 'react'
import { Upload, FileText, Loader2 } from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'
import { parseFile } from '../../core/parser'

export function FileUploader() {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isParsing, setIsParsing, setMarkdown, setRawMarkdown, setFileName } =
    useEditorStore()

  const handleFile = useCallback(
    async (file: File) => {
      setIsParsing(true)
      try {
        const result = await parseFile(file)
        setRawMarkdown(result.markdown)
        setMarkdown(result.markdown)
        setFileName(result.fileName)
      } catch (err) {
        alert(`文件解析失败: ${err instanceof Error ? err.message : '未知错误'}`)
      } finally {
        setIsParsing(false)
      }
    },
    [setIsParsing, setMarkdown, setRawMarkdown, setFileName]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`
          w-full border-2 border-dashed rounded-xl p-8 cursor-pointer
          flex flex-col items-center justify-center gap-4
          transition-all duration-200
          ${
            isDragging
              ? 'border-brand bg-brand-light'
              : 'border-border hover:border-brand/50 hover:bg-surface-secondary'
          }
        `}
      >
        {isParsing ? (
          <Loader2 className="w-12 h-12 text-brand animate-spin" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center">
            <Upload className="w-8 h-8 text-brand" />
          </div>
        )}

        <div className="text-center">
          <p className="text-text-primary font-medium">
            {isParsing ? '解析中...' : '拖拽文件到此处，或点击上传'}
          </p>
          <p className="text-sm text-text-muted mt-1">
            支持 .docx 和 .pdf 格式
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted">
          <FileText className="w-4 h-4" />
          <span>Word 文档 / PDF 文件</span>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
        className="hidden"
      />
    </div>
  )
}
