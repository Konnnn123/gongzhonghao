import { copyToClipboard as copy } from '../core/clipboard/copyToClipboard'

export function useClipboard() {
  const copyToClipboard = async () => {
    try {
      await copy()
    } catch (err) {
      console.error('复制失败:', err)
      // 降级方案
      const editor = (window as any).__tiptapEditor
      if (editor) {
        const el = document.querySelector('.tiptap-editor')
        if (el) {
          const range = document.createRange()
          range.selectNodeContents(el)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
          try { document.execCommand('copy') } finally { selection?.removeAllRanges() }
        }
      }
    }
  }

  return { copyToClipboard }
}
