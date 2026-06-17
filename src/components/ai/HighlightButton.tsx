import { Sparkles, Loader2 } from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'
import { useAIHighlight } from '../../hooks/useAIHighlight'

export function HighlightButton() {
  const { isAiProcessing } = useEditorStore()
  const { runAIHighlight } = useAIHighlight()

  return (
    <button
      onClick={runAIHighlight}
      disabled={isAiProcessing}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-brand text-white hover:bg-brand-dark transition-colors disabled:opacity-50"
    >
      {isAiProcessing ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Sparkles className="w-4 h-4" />
      )}
      {isAiProcessing ? 'AI 分析中...' : 'AI 划重点'}
    </button>
  )
}
