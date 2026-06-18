import { Node, mergeAttributes } from '@tiptap/core'

/**
 * WeChatReference —— 微信公众号参考文献区块
 *
 * 视觉降级：小字号、浅灰色、紧凑行距
 * 用于包裹文章底部的参考文献/引用列表
 */

export const WeChatReference = Node.create({
  name: 'wechatReference',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [
      { tag: 'section[data-type="reference"]' },
      { tag: 'small' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'section',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'reference',
        style: 'font-size: 13px; color: #888888; line-height: 1.6; margin-top: 16px; margin-bottom: 8px; word-break: break-all; overflow-wrap: break-word; padding-top: 12px; border-top-width: 1px; border-top-style: solid; border-top-color: #e5e6eb;',
      }),
      0,
    ]
  },
})
