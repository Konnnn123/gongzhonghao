import { X } from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'

const PRESETS = [
  {
    label: 'DeepSeek',
    endpoint: 'https://api.deepseek.com',
    model: 'deepseek-chat',
  },
  {
    label: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    model: 'gpt-4o',
  },
  {
    label: 'Mimo',
    endpoint: 'https://api.mimo.ai/v1',
    model: 'mimo-chat',
  },
]

export function AISettings() {
  const { aiConfig, setAIConfig, setShowAiSettings } = useEditorStore()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-surface rounded-xl shadow-xl w-[420px] max-w-[90vw] overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-text-primary">
            AI 接口设置
          </h3>
          <button
            onClick={() => setShowAiSettings(false)}
            className="p-1 rounded hover:bg-surface-secondary transition-colors"
          >
            <X className="w-4 h-4 text-text-muted" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-5 space-y-4">
          {/* 快捷预设 */}
          <div>
            <label className="text-xs text-text-secondary block mb-2">
              快捷选择
            </label>
            <div className="flex gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() =>
                    setAIConfig({ endpoint: p.endpoint, model: p.model })
                  }
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    aiConfig.endpoint === p.endpoint
                      ? 'bg-brand text-white border-brand'
                      : 'bg-surface text-text-secondary border-border hover:border-brand/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="text-xs text-text-secondary block mb-1">
              API Key
            </label>
            <input
              type="password"
              value={aiConfig.apiKey}
              onChange={(e) => setAIConfig({ apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand"
            />
          </div>

          {/* Endpoint */}
          <div>
            <label className="text-xs text-text-secondary block mb-1">
              API Endpoint
            </label>
            <input
              type="text"
              value={aiConfig.endpoint}
              onChange={(e) => setAIConfig({ endpoint: e.target.value })}
              placeholder="https://api.deepseek.com"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand"
            />
          </div>

          {/* Model */}
          <div>
            <label className="text-xs text-text-secondary block mb-1">
              模型名称
            </label>
            <input
              type="text"
              value={aiConfig.model}
              onChange={(e) => setAIConfig({ model: e.target.value })}
              placeholder="deepseek-chat"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface focus:outline-none focus:border-brand"
            />
          </div>
        </div>

        {/* 底部 */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-border">
          <button
            onClick={() => setShowAiSettings(false)}
            className="px-4 py-1.5 text-sm rounded-md border border-border hover:bg-surface-secondary transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => setShowAiSettings(false)}
            className="px-4 py-1.5 text-sm rounded-md bg-brand text-white hover:bg-brand-dark transition-colors"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}
