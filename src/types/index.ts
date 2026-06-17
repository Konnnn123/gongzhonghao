/** AI 配置 */
export interface AIConfig {
  apiKey: string
  endpoint: string
  model: string
}

/** H2 样式预设 */
export type H2StylePreset =
  | 'number-circle'   // 序号圆点
  | 'color-block'     // 色块内嵌
  | 'double-line'     // 双线夹击
  | 'number-guide'    // 序号引路
  | 'brand-bg'        // 品牌色背景
  | 'bottom-line'     // 底部线条

/** H3 样式预设 */
export type H3StylePreset =
  | 'left-bar'        // 左侧色条
  | 'capsule'         // 胶囊微标
  | 'solid-block'     // 左侧实心方块
  | 'dashed-underline'// 虚线托底
  | 'plain-bold'      // 简洁加粗
  | 'brand-text'      // 品牌色文字

/** 排版配置 */
export interface TypographyConfig {
  fontSize: number
  lineHeight: number
  paragraphSpacing: number
  textAlign: 'left' | 'justify'
  fontFamily: string
  brandColor: string
}

/** 全局编辑器状态 */
export interface EditorState {
  rawMarkdown: string
  markdown: string
  images: Record<string, string>
  aiConfig: AIConfig
  h2Style: H2StylePreset
  h3Style: H3StylePreset
  typography: TypographyConfig
  isParsing: boolean
  isAiProcessing: boolean
  fileName: string | null
  showAiSettings: boolean

  setMarkdown: (md: string) => void
  setRawMarkdown: (md: string) => void
  addImage: (id: string, base64: string) => void
  removeImage: (id: string) => void
  setAIConfig: (config: Partial<AIConfig>) => void
  setH2Style: (style: H2StylePreset) => void
  setH3Style: (style: H3StylePreset) => void
  setTypography: (config: Partial<TypographyConfig>) => void
  setIsParsing: (v: boolean) => void
  setIsAiProcessing: (v: boolean) => void
  setFileName: (name: string | null) => void
  setShowAiSettings: (v: boolean) => void
  reset: () => void
}

export interface ParsedFile {
  markdown: string
  fileName: string
}
