import { Mark, mergeAttributes } from '@tiptap/core'

/**
 * WeChatHighlight —— 微信公众号兼容的高亮 Mark
 *
 * 核心修复：
 * 1. parseHTML 严格匹配：只认 <mark> 和带 data-type="wechat-highlight" 的 <span>
 * 2. renderHTML 打上 data-type 标记，确保反解析准确
 * 3. 不再继承 Highlight 扩展，避免 parseHTML 冲突
 */

export const WeChatHighlight = Mark.create({
  name: 'wechatHighlight',

  addAttributes() {
    return {
      color: {
        default: '#EAEFF4',
        parseHTML: (el: HTMLElement) => {
          return el.getAttribute('data-color') || el.style.backgroundColor || '#EAEFF4'
        },
      },
    }
  },

  parseHTML() {
    return [
      // 兼容标准 <mark> 标签
      { tag: 'mark' },
      // 只匹配带 data-type="wechat-highlight" 的 <span>
      {
        tag: 'span[data-type="wechat-highlight"]',
      },
      // 兼容旧数据：带 data-color 的 <span>
      {
        tag: 'span[data-color]',
      },
      // 【不再匹配】普通 <span style="background-color:..."> —— 那是 TextStyle 的地盘
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'wechat-highlight',
        style: `background-color: ${HTMLAttributes.color || '#EAEFF4'}; padding: 2px 4px; border-radius: 2px; color: inherit;`,
      }),
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
    }
  },
})

/** 更新所有高亮标记的背景色 */
export function syncHighlightColor(editor: any, newColor: string) {
  if (!editor?.view) return
  const { state, view } = editor
  const markType = state.schema.marks.weChatHighlight
  if (!markType) return

  // 先收集所有需要更新的位置
  const updates: { from: number; to: number; oldMark: any }[] = []
  state.doc.descendants((node: any, pos: number) => {
    if (!node.marks) return
    for (const mark of node.marks) {
      if (mark.type.name === 'wechatHighlight' && mark.attrs.color !== newColor) {
        updates.push({ from: pos, to: pos + node.nodeSize, oldMark: mark })
      }
    }
  })

  if (updates.length === 0) return

  let tr = state.tr
  for (const { from, to, oldMark } of updates) {
    tr = tr.removeMark(from, to, oldMark)
    tr = tr.addMark(from, to, markType.create({ color: newColor }))
  }
  view.dispatch(tr)
}
