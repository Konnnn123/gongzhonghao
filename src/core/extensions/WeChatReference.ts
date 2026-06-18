import { Node, mergeAttributes } from '@tiptap/core'

/**
 * WeChatReference —— 微信公众号参考文献区块
 *
 * 极致紧凑：13px 浅灰 + margin 压到最小 + font-weight: normal
 */

export const WeChatReference = Node.create({
  name: 'wechatReference',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [
      { tag: 'section[data-type="reference"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'reference',
        style: 'font-size: 13px; color: #888888; line-height: 1.5; margin: 0 0 6px 0; padding: 0; word-break: break-all; overflow-wrap: break-word; font-weight: normal;',
      }),
      0,
    ]
  },
})
