import { Sparkles } from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'
import { useAIHighlight } from '../../hooks/useAIHighlight'

export function HighlightButton() {
  const { isAiProcessing } = useEditorStore()
  const { runAIHighlight } = useAIHighlight()

  return (
    <button
      onClick={runAIHighlight}
      disabled={isAiProcessing}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md font-bold transition-all ${
        isAiProcessing
          ? 'bg-gray-400 cursor-not-allowed text-white'
          : 'bg-brand text-white hover:bg-brand-dark'
      }`}
    >
      {isAiProcessing ? (
        <>
          {/* CSS 旋转动画图标 */}
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          AI 正在深度阅读与排版中...
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4" />
          ✨ 一键 AI 排版
        </>
      )}
    </button>
  )
}
