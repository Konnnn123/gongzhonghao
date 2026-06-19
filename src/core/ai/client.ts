import type { AIConfig } from '../../types'
import { SYSTEM_PROMPT, buildUserPrompt } from './prompts'

/**
 * 调用 AI API 进行智能划重点
 * 使用 OpenAI 兼容的 Chat Completions 格式
 */
export async function callAI(
  markdown: string,
  config: AIConfig
): Promise<string> {
  if (!config.apiKey) {
    throw new Error('请先配置 API Key')
  }

  const url = `${config.endpoint}/chat/completions`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(markdown) },
      ],
      temperature: 0.5,
      max_tokens: 8192,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`AI API 请求失败 (${response.status}): ${error}`)
  }

  const data = await response.json()

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('AI 返回结果为空，请重试')
  }

  return data.choices[0].message.content.trim()
}
