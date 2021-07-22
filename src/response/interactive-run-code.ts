import { Message } from 'discord.js'
import { runCode } from '../util/run-code'

export const interactiveRunCode = async (
  message: Message
): Promise<boolean> => {
  const programMatch = message.content.match(/(?<=^```(js|javascript)(\r\n|\n|\r)).+(?=(\r\n|\n|\r)+```)/sim)
  if (!programMatch) return false

  const code = programMatch[0]

  try {
    const result = await runCode(code)
    const separatedResult = JSON.stringify(result, null, 4).match(/.{1,1900}/gms)
    separatedResult.forEach(result => {
      message.channel.send('```\n' + result + '\n```')
    })
    message.channel.send('コードの実行が正常に終了しました。')
  } catch (e) {
    message.channel.send(`コードの実行中にエラーが発生しました。(${e})`)
  }

  return true
}
