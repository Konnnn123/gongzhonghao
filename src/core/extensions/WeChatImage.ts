import Image from '@tiptap/extension-image'
import { mergeAttributes } from '@tiptap/core'

/**
 * WeChatImage —— 微信公众号兼容的图片扩展
 * 强制响应式样式 + 居中 + 圆角
 */

export const WeChatImage = Image.extend({
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'img',
      mergeAttributes(HTMLAttributes, {
        style: 'max-width: 100%; height: auto; display: block; margin: 15px auto; border-radius: 8px;',
      }),
    ]
  },
})
