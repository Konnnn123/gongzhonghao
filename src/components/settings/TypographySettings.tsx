import { useEditorStore } from '../../store/useEditorStore'

const FONT_FAMILIES = [
  { label: '默认', value: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" },
  { label: '宋体', value: "'SimSun', 'STSong', serif" },
  { label: '黑体', value: "'SimHei', 'STHeiti', sans-serif" },
  { label: '楷体', value: "'KaiTi', 'STKaiti', serif" },
]

export function TypographySettings() {
  const { typography, setTypography } = useEditorStore()

  return (
    <div className="space-y-3">
      {/* 字号 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-text-secondary">字号</label>
          <span className="text-xs text-brand font-medium">{typography.fontSize}px</span>
        </div>
        <input
          type="range"
          min={12}
          max={20}
          step={1}
          value={typography.fontSize}
          onChange={(e) => setTypography({ fontSize: Number(e.target.value) })}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-brand"
        />
      </div>

      {/* 行高 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-text-secondary">行高</label>
          <span className="text-xs text-brand font-medium">{typography.lineHeight}</span>
        </div>
        <input
          type="range"
          min={1.2}
          max={3}
          step={0.1}
          value={typography.lineHeight}
          onChange={(e) => setTypography({ lineHeight: Number(e.target.value) })}
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-brand"
        />
      </div>

      {/* 段落间距 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-text-secondary">段落间距</label>
          <span className="text-xs text-brand font-medium">{typography.paragraphSpacing}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={40}
          step={2}
          value={typography.paragraphSpacing}
          onChange={(e) =>
            setTypography({ paragraphSpacing: Number(e.target.value) })
          }
          className="w-full h-1.5 bg-border rounded-full appearance-none cursor-pointer accent-brand"
        />
      </div>

      {/* 文本对齐 */}
      <div>
        <label className="text-xs text-text-secondary block mb-1">对齐方式</label>
        <div className="flex gap-1">
          {(['left', 'justify'] as const).map((align) => (
            <button
              key={align}
              onClick={() => setTypography({ textAlign: align })}
              className={`flex-1 py-1.5 text-xs rounded border transition-colors ${
                typography.textAlign === align
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface text-text-secondary border-border hover:border-brand/50'
              }`}
            >
              {align === 'left' ? '左对齐' : '两端对齐'}
            </button>
          ))}
        </div>
      </div>

      {/* 字体 */}
      <div>
        <label className="text-xs text-text-secondary block mb-1">字体</label>
        <div className="space-y-1">
          {FONT_FAMILIES.map((font) => (
            <button
              key={font.value}
              onClick={() => setTypography({ fontFamily: font.value })}
              className={`w-full py-1.5 px-2 text-xs rounded border text-left transition-colors ${
                typography.fontFamily === font.value
                  ? 'bg-brand text-white border-brand'
                  : 'bg-surface text-text-secondary border-border hover:border-brand/50'
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      {/* 品牌色（主色） */}
      <div>
        <label className="text-xs text-text-secondary block mb-1">品牌色（主色）</label>
        <p className="text-[10px] text-text-muted mb-1.5">用于 **加粗** 标记的核心结论</p>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={typography.brandColor}
            onChange={(e) => setTypography({ brandColor: e.target.value })}
            className="w-8 h-8 rounded cursor-pointer border border-border"
          />
          <input
            type="text"
            value={typography.brandColor}
            onChange={(e) => setTypography({ brandColor: e.target.value })}
            className="flex-1 px-2 py-1 text-xs border border-border rounded bg-surface"
          />
        </div>
      </div>
    </div>
  )
}
