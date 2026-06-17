import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EditorState } from '../types'

const initialState = {
  rawMarkdown: '',
  markdown: '',
  images: {} as Record<string, string>,
  aiConfig: {
    apiKey: '',
    endpoint: 'https://api.deepseek.com',
    model: 'deepseek-chat',
  },
  h2Style: 'number-circle' as const,
  h3Style: 'left-bar' as const,
  typography: {
    fontSize: 15,
    lineHeight: 1.8,
    paragraphSpacing: 20,
    textAlign: 'left' as const,
    fontFamily: "'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
    brandColor: '#1e80ff',
  },
  isParsing: false,
  isAiProcessing: false,
  fileName: null as string | null,
  showAiSettings: false,
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      ...initialState,

      setMarkdown: (md) => set({ markdown: md }),
      setRawMarkdown: (md) => set({ rawMarkdown: md }),
      addImage: (id, base64) =>
        set((state) => ({ images: { ...state.images, [id]: base64 } })),
      removeImage: (id) =>
        set((state) => {
          const { [id]: _, ...rest } = state.images
          return { images: rest }
        }),
      setAIConfig: (config) =>
        set((state) => ({ aiConfig: { ...state.aiConfig, ...config } })),
      setH2Style: (style) => set({ h2Style: style }),
      setH3Style: (style) => set({ h3Style: style }),
      setTypography: (config) =>
        set((state) => ({ typography: { ...state.typography, ...config } })),
      setIsParsing: (v) => set({ isParsing: v }),
      setIsAiProcessing: (v) => set({ isAiProcessing: v }),
      setFileName: (name) => set({ fileName: name }),
      setShowAiSettings: (v) => set({ showAiSettings: v }),
      reset: () => set(initialState),
    }),
    {
      name: 'wx-format-store',
      partialize: (state) => ({
        aiConfig: state.aiConfig,
        typography: state.typography,
        h2Style: state.h2Style,
        h3Style: state.h3Style,
      }),
    }
  )
)
