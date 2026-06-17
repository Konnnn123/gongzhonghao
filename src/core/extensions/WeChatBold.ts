import Bold from '@tiptap/extension-bold'
import { mergeAttributes } from '@tiptap/core'

/**
 * WeChatBold —— 微信公众号兼容的加粗 Mark
 *
 * 核心：输出 <strong style="color: 品牌色; font-weight: bold;"> 内联样式
 * 不依赖 CSS class，微信可直接识别
 */

export const WeChatBold = Bold.extend({
  name: 'wechatBold',

  addAttributes() {
    return {
      color: {
        default: 'inherit',
        parseHTML: (el: HTMLElement) => el.style.color || 'inherit',
      },
    }
  },

  renderHTML({ HTMLAttributes }) {
    const color = HTMLAttributes.color || 'inherit'
    const style = color !== 'inherit'
      ? `color: ${color}; font-weight: bold;`
      : 'font-weight: bold;'
    return ['strong', mergeAttributes(HTMLAttributes, { style }), 0]
  },
})
