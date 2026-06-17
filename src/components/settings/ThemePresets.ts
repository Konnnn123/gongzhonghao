import type { H2StylePreset, H3StylePreset, TypographyConfig } from '../../types'

export interface ThemePreset {
  name: string
  description: string
  h2Style: H2StylePreset
  h3Style: H3StylePreset
  typography: Partial<TypographyConfig>
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    name: '知识专栏风',
    description: '沉稳学术 · 逻辑推导 · 科普解析',
    h2Style: 'color-block',
    h3Style: 'solid-block',
    typography: {
      brandColor: '#2B4A6F',
      fontSize: 15,
      lineHeight: 1.75,
      paragraphSpacing: 15,
      textAlign: 'left',
    },
  },
  {
    name: '人文关怀风',
    description: '柔和低压力 · 心理随笔 · 社群观察',
    h2Style: 'double-line',
    h3Style: 'dashed-underline',
    typography: {
      brandColor: '#7D8D7B',
      fontSize: 15,
      lineHeight: 2.0,
      paragraphSpacing: 25,
      textAlign: 'left',
    },
  },
  {
    name: '极简架构风',
    description: '利落现代 · 技术日志 · 商业评论',
    h2Style: 'number-guide',
    h3Style: 'capsule',
    typography: {
      brandColor: '#B06A54',
      fontSize: 15,
      lineHeight: 1.6,
      paragraphSpacing: 15,
      textAlign: 'left',
    },
  },
]
