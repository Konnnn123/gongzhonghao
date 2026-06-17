/**
 * 将标准 <h2>/<h3> 转换为 <div data-wechat-heading> 格式
 * 供 WeChatHeading 扩展正确解析
 */
export function convertHeadingsToWeChat(
  html: string,
  h2Style: string,
  h3Style: string,
  brandColor: string
): string {
  return html
    .replace(
      /<h2>([\s\S]*?)<\/h2>/g,
      (_, content) => `<div data-wechat-heading data-wx-level="2" data-wx-style="${h2Style}" data-wx-color="${brandColor}">${content}</div>`
    )
    .replace(
      /<h3>([\s\S]*?)<\/h3>/g,
      (_, content) => `<div data-wechat-heading data-wx-level="3" data-wx-style="${h3Style}" data-wx-color="${brandColor}">${content}</div>`
    )
}
