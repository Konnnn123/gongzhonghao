import {
  Upload,
  Sparkles,
  Settings,
  Copy,
  FileText,
  RotateCcw,
} from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'
import { useClipboard } from '../../hooks/useClipboard'
import { useAIHighlight } from '../../hooks/useAIHighlight'
import { useRef } from 'react'
import { parseFile } from '../../core/parser'

export function Toolbar() {
  const {
    fileName,
    isAiProcessing,
    setMarkdown,
    setRawMarkdown,
    setFileName,
    setIsParsing,
    setShowAiSettings,
    reset,
  } = useEditorStore()

  const { copyToClipboard } = useClipboard()
  const { runAIHighlight } = useAIHighlight()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-border bg-surface flex-shrink-0">
      {/* 左侧：Logo + 文件名 */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand" />
          <span className="font-semibold text-text-primary">AI 公众号排版</span>
        </div>
        {fileName && (
          <>
            <span className="text-border">|</span>
            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <FileText className="w-4 h-4" />
              <span>{fileName}</span>
            </div>
          </>
        )}
      </div>

      {/* 右侧：操作按钮 */}
      <div className="flex items-center gap-2">
        {fileName && (
          <>
            {/* AI 划重点 */}
            <button
              onClick={runAIHighlight}
              disabled={isAiProcessing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isAiProcessing ? 'AI 分析中...' : 'AI 划重点'}
            </button>

            {/* AI 设置 */}
            <button
              onClick={() => setShowAiSettings(true)}
              className="p-1.5 rounded-md border border-border hover:bg-surface-secondary transition-colors"
              title="AI 设置"
            >
              <Settings className="w-4 h-4 text-text-secondary" />
            </button>

            {/* 一键复制 */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-success text-white hover:opacity-90 transition-colors"
            >
              <Copy className="w-4 h-4" />
              一键复制
            </button>

            {/* 重新上传 */}
            <button
              onClick={reset}
              className="p-1.5 rounded-md border border-border hover:bg-surface-secondary transition-colors"
              title="重新上传"
            >
              <RotateCcw className="w-4 h-4 text-text-secondary" />
            </button>
          </>
        )}

        {/* 上传按钮（始终可用） */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-border hover:bg-surface-secondary transition-colors"
        >
          <Upload className="w-4 h-4" />
          上传文件
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </header>
  )
}
