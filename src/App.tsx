import { useEditorStore } from './store/useEditorStore'
import { Toolbar } from './components/toolbar/Toolbar'
import { FileUploader } from './components/upload/FileUploader'
import { TipTapEditor } from './components/editor/TipTapEditor'
import { StyleSettings } from './components/settings/StyleSettings'
import { AISettings } from './components/ai/AISettings'

function App() {
  const { fileName, showAiSettings } = useEditorStore()

  return (
    <div className="flex flex-col h-screen bg-surface-secondary">
      {/* 顶部工具栏 */}
      <Toolbar />

      {/* 主体区域 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左侧：无文件时显示上传区 */}
        {!fileName && (
          <div className="w-80 flex-shrink-0 border-r border-border bg-surface p-6">
            <FileUploader />
          </div>
        )}

        {/* 中间：TipTap 富文本编辑器 */}
        <div className="flex-1 overflow-hidden">
          {fileName ? (
            <TipTapEditor />
          ) : (
            <div className="flex-1 flex items-center justify-center text-text-muted h-full">
              <div className="text-center">
                <div className="text-6xl mb-4">📄</div>
                <p className="text-lg">上传 Word 或 PDF 文件开始排版</p>
                <p className="text-sm mt-2">支持 .docx 和 .pdf 格式</p>
              </div>
            </div>
          )}
        </div>

        {/* 右侧：设置面板（有文件时显示） */}
        {fileName && (
          <div className="w-72 flex-shrink-0 border-l border-border bg-surface overflow-y-auto">
            <StyleSettings />
          </div>
        )}
      </div>

      {/* AI 设置弹窗 */}
      {showAiSettings && <AISettings />}
    </div>
  )
}

export default App
