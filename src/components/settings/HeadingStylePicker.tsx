import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useEditorStore } from '../../store/useEditorStore'
import type { H2StylePreset, H3StylePreset } from '../../types'

const H2_PRESETS: { key: H2StylePreset; label: string }[] = [
  { key: 'number-circle', label: '序号圆点' },
  { key: 'color-block', label: '色块内嵌' },
  { key: 'double-line', label: '双线夹击' },
  { key: 'number-guide', label: '序号引路' },
  { key: 'brand-bg', label: '品牌色背景' },
  { key: 'bottom-line', label: '底部线条' },
]

const H3_PRESETS: { key: H3StylePreset; label: string }[] = [
  { key: 'left-bar', label: '左侧色条' },
  { key: 'capsule', label: '胶囊微标' },
  { key: 'solid-block', label: '实心方块' },
  { key: 'dashed-underline', label: '虚线托底' },
  { key: 'plain-bold', label: '简洁加粗' },
  { key: 'brand-text', label: '品牌色文字' },
]

/** 通过 TipTap API 更新编辑器中所有 WeChatHeading 节点的 themeStyle */
function updateAllHeadings(editor: any, level: number, newStyle: string) {
  if (!editor?.view) return
  const { state, view } = editor
  let tr = state.tr
  let found = false
  state.doc.descendants((node: any, pos: number) => {
    if (node.type.name === 'wechatHeading' && node.attrs.headingLevel === level) {
      if (node.attrs.themeStyle !== newStyle) {
        tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, themeStyle: newStyle })
        found = true
      }
    }
  })
  if (found) view.dispatch(tr)
}

export function HeadingStylePicker() {
  const { h2Style, h3Style, setH2Style, setH3Style, typography } = useEditorStore()
  const { brandColor } = typography
  const [h2Open, setH2Open] = useState(true)
  const [h3Open, setH3Open] = useState(true)

  const changeH2 = (style: H2StylePreset) => {
    setH2Style(style)
    const editor = (window as any).__tiptapEditor
    if (editor) updateAllHeadings(editor, 2, style)
  }

  const changeH3 = (style: H3StylePreset) => {
    setH3Style(style)
    const editor = (window as any).__tiptapEditor
    if (editor) updateAllHeadings(editor, 3, style)
  }

  return (
    <div className="space-y-3">
      {/* H2 折叠 */}
      <div>
        <button onClick={() => setH2Open(!h2Open)} className="flex items-center gap-1.5 w-full text-xs text-text-secondary font-medium mb-2">
          {h2Open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          H2 小标题
          <span className="text-[10px] text-text-muted ml-auto">当前: {H2_PRESETS.find(p => p.key === h2Style)?.label}</span>
        </button>
        {h2Open && (
          <div className="space-y-1.5">
            {H2_PRESETS.map((p) => (
              <button key={p.key} onClick={() => changeH2(p.key)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all ${h2Style === p.key ? 'border-brand bg-brand-light ring-1 ring-brand/20' : 'border-border bg-surface hover:border-brand/50'}`}>
                {p.key === 'number-circle' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-bold" style={{ background: brandColor }}>1</span>
                    <span className="text-gray-300 text-sm">/</span>
                    <span className="text-sm font-bold text-gray-700">标题文字</span>
                  </div>
                )}
                {p.key === 'color-block' && <div className="inline-block text-white text-sm font-bold px-3 py-1 rounded mb-1" style={{ background: brandColor }}>标题文字</div>}
                {p.key === 'double-line' && (
                  <div className="text-center mb-1 py-1" style={{ borderTop: '2px solid #333', borderBottom: '1px solid #ccc' }}>
                    <span className="text-sm font-bold text-gray-700" style={{ letterSpacing: '1px' }}>标题文字</span>
                  </div>
                )}
                {p.key === 'number-guide' && (
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-lg font-black italic" style={{ color: `${brandColor}4D` }}>01</span>
                    <span className="text-sm font-bold pb-0.5" style={{ color: brandColor, borderBottom: `2px solid ${brandColor}` }}>标题文字</span>
                  </div>
                )}
                {p.key === 'brand-bg' && <div className="text-sm font-bold mb-1 px-2 py-0.5 rounded inline-block" style={{ color: brandColor, background: `${brandColor}10` }}>标题文字</div>}
                {p.key === 'bottom-line' && <div className="text-sm font-bold mb-1 pb-1" style={{ color: '#333', borderBottom: `2px solid ${brandColor}` }}>标题文字</div>}
                <span className="text-[10px] text-text-muted">{p.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* H3 折叠 */}
      <div>
        <button onClick={() => setH3Open(!h3Open)} className="flex items-center gap-1.5 w-full text-xs text-text-secondary font-medium mb-2">
          {h3Open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          H3 子标题
          <span className="text-[10px] text-text-muted ml-auto">当前: {H3_PRESETS.find(p => p.key === h3Style)?.label}</span>
        </button>
        {h3Open && (
          <div className="space-y-1.5">
            {H3_PRESETS.map((p) => (
              <button key={p.key} onClick={() => changeH3(p.key)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all ${h3Style === p.key ? 'border-brand bg-brand-light ring-1 ring-brand/20' : 'border-border bg-surface hover:border-brand/50'}`}>
                {p.key === 'left-bar' && <div className="text-sm font-semibold mb-1 pl-2 rounded-r" style={{ borderLeft: `3px solid ${brandColor}`, background: `${brandColor}0D`, color: brandColor }}>标题文字</div>}
                {p.key === 'capsule' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ borderColor: brandColor, color: brandColor }}>要点</span>
                    <span className="text-sm font-bold text-gray-700">标题文字</span>
                  </div>
                )}
                {p.key === 'solid-block' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="inline-block w-1.5 h-4 rounded-sm" style={{ background: brandColor }} />
                    <span className="text-sm font-bold text-gray-700">标题文字</span>
                  </div>
                )}
                {p.key === 'dashed-underline' && <div className="text-sm font-bold mb-1 pb-1 inline-block" style={{ color: '#555', borderBottom: `1px dashed ${brandColor}` }}>标题文字</div>}
                {p.key === 'plain-bold' && <div className="text-sm font-bold mb-1" style={{ color: '#1d2129' }}>标题文字</div>}
                {p.key === 'brand-text' && <div className="text-sm font-semibold mb-1" style={{ color: brandColor }}>标题文字</div>}
                <span className="text-[10px] text-text-muted">{p.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
