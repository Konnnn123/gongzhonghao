import Paragraph from '@tiptap/extension-paragraph'
import BulletList from '@tiptap/extension-bullet-list'
import ListItem from '@tiptap/extension-list-item'
import OrderedList from '@tiptap/extension-ordered-list'
import Blockquote from '@tiptap/extension-blockquote'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import { mergeAttributes } from '@tiptap/core'

/**
 * 微信公众号基础标签覆盖
 * 微信会重置 p/ul/ol/li/blockquote/hr 的默认样式
 * 必须通过 renderHTML 强制写入内联样式
 */

export const WeChatParagraph = Paragraph.extend({
  addAttributes() {
    return {
      fontSize: { default: '15px' },
      lineHeight: { default: '2' },
      marginBottom: { default: '20px' },
    }
  },

  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, {
      style: `font-size: ${HTMLAttributes.fontSize}; line-height: ${HTMLAttributes.lineHeight}; margin-bottom: ${HTMLAttributes.marginBottom}; text-align: justify; word-wrap: break-word; letter-spacing: 0.05em;`,
    }), 0]
  },
})

export const WeChatBulletList = BulletList.extend({
  renderHTML({ HTMLAttributes }) {
    return ['ul', mergeAttributes(HTMLAttributes, {
      style: 'margin-top: 10px; margin-bottom: 20px; padding-left: 25px; list-style-type: disc;',
    }), 0]
  },
})

export const WeChatOrderedList = OrderedList.extend({
  renderHTML({ HTMLAttributes }) {
    return ['ol', mergeAttributes(HTMLAttributes, {
      style: 'margin-top: 10px; margin-bottom: 20px; padding-left: 25px; list-style-type: decimal;',
    }), 0]
  },
})

export const WeChatListItem = ListItem.extend({
  renderHTML({ HTMLAttributes }) {
    return ['li', mergeAttributes(HTMLAttributes, {
      style: 'font-size: 15px; line-height: 2; margin-bottom: 8px;',
    }), 0]
  },
})

export const WeChatBlockquote = Blockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return ['blockquote', mergeAttributes(HTMLAttributes, {
      style: 'border-left-width: 3px; border-left-style: solid; border-left-color: #cccccc; padding-left: 16px; padding-right: 16px; margin-top: 16px; margin-bottom: 16px; color: #666666; font-size: 14px; line-height: 1.8;',
    }), 0]
  },
})

export const WeChatHorizontalRule = HorizontalRule.extend({
  renderHTML() {
    return ['hr', { style: 'border: none; border-top-width: 1px; border-top-style: solid; border-top-color: #e5e6eb; margin-top: 24px; margin-bottom: 24px;' }]
  },
})
