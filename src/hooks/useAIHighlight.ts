import { useEditorStore } from '../store/useEditorStore'
import { callAI } from '../core/ai/client'
import { htmlToMarkdown } from '../core/editor/markdownConvert'

export function useAIHighlight() {
  const {
    aiConfig,
    setIsAiProcessing,
    setMarkdown,
  } = useEditorStore()

  const runAIHighlight = async () => {
    // 从 TipTap 编辑器获取当前 HTML 内容
    const editor = (window as any).__tiptapEditor
    if (!editor) {
      alert('编辑器未就绪，请稍后重试')
      return
    }

    const html = editor.getHTML()
    if (!html || html === '<p></p>') {
      alert('请先输入或上传内容')
      return
    }

    if (!aiConfig.apiKey) {
      alert('请先在设置中配置 API Key')
      useEditorStore.getState().setShowAiSettings(true)
      return
    }

    setIsAiProcessing(true)
    try {
      // HTML → Markdown（发给 AI）
      const markdown = await htmlToMarkdown(html)

      // AI 处理
      const result = await callAI(markdown, aiConfig)

      // 结果写入 store → TipTap useEffect 检测到变化 → 自动更新编辑器
      setMarkdown(result)
    } catch (err) {
      alert(
        `AI 分析失败: ${err instanceof Error ? err.message : '未知错误'}`
      )
    } finally {
      setIsAiProcessing(false)
    }
  }

  return { runAIHighlight }
}
