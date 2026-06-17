import { Type, Palette, Heading, Sparkles } from 'lucide-react'
import { TypographySettings } from './TypographySettings'
import { HeadingStylePicker } from './HeadingStylePicker'
import { ThemePicker } from './ThemePicker'

export function StyleSettings() {
  return (
    <div className="p-4 space-y-6">
      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
        <Palette className="w-4 h-4" />
        样式设置
      </h3>

      {/* 主题预设 */}
      <section className="space-y-3">
        <h4 className="text-xs font-medium text-text-muted flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          主题预设
        </h4>
        <ThemePicker />
      </section>

      <hr className="border-border" />

      {/* 排版 */}
      <section className="space-y-3">
        <h4 className="text-xs font-medium text-text-muted flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5" />
          排版
        </h4>
        <TypographySettings />
      </section>

      <hr className="border-border" />

      {/* 标题样式 */}
      <section className="space-y-3">
        <h4 className="text-xs font-medium text-text-muted flex items-center gap-1.5">
          <Heading className="w-3.5 h-3.5" />
          标题样式
        </h4>
        <HeadingStylePicker />
      </section>
    </div>
  )
}
