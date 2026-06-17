import { Mark } from '@tiptap/core'

/**
 * WeChatHighlight —— 微信公众号兼容的高亮 Mark
 *
 * 属性：color（背景色）+ textColor（文字色）
 * 输出 <span> 而非 <mark>
 */

export const WeChatHighlight = Mark.create({
  name: 'wechatHighlight',

  addAttributes() {
    return {
      color: { default: '#EAEFF4' },
      textColor: { default: '#1A3250' },
    }
  },

  parseHTML() {
    return [
      { tag: 'mark' },
      { tag: 'span[data-type="wechat-highlight"]' },
      { tag: 'span[data-color]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        'data-type': 'wechat-highlight',
        style: `background-color: ${HTMLAttributes.color}; color: ${HTMLAttributes.textColor}; padding: 2px 4px; border-radius: 2px;`,
      },
      0,
    ]
  },

  addCommands() {
    return {
      toggleHighlight:
        (attributes?: Record<string, any>) =>
        ({ commands }: any) => {
          if (commands.isActive(this.name)) {
            return commands.unsetMark(this.name)
          }
          return commands.setMark(this.name, attributes)
        },
    } as any
  },
})
