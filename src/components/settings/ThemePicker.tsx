import { useEditorStore } from '../../store/useEditorStore'
import { THEME_PRESETS } from './ThemePresets'

export function ThemePicker() {
  const { setH2Style, setH3Style, setTypography, typography } = useEditorStore()

  const applyTheme = (idx: number) => {
    const theme = THEME_PRESETS[idx]
    setH2Style(theme.h2Style)
    setH3Style(theme.h3Style)
    setTypography(theme.typography)
  }

  return (
    <div className="space-y-2">
      {THEME_PRESETS.map((theme, idx) => (
        <button
          key={theme.name}
          onClick={() => applyTheme(idx)}
          className={`w-full p-3 rounded-lg border text-left transition-all hover:border-brand/50`}
          style={{
            borderLeftWidth: '4px',
            borderLeftColor: theme.typography.brandColor,
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-text-primary">{theme.name}</span>
            <span
              className="w-3 h-3 rounded-full"
              style={{ background: theme.typography.brandColor }}
            />
          </div>
          <p className="text-[10px] text-text-muted">{theme.description}</p>
          <div className="flex gap-1 mt-1.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted">
              H2: {theme.h2Style}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-secondary text-text-muted">
              H3: {theme.h3Style}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
}
