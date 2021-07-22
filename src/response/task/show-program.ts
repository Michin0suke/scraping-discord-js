import { Message } from 'discord.js'
import { ScheduledTask } from '../../entity/ScheduledTask'

export const showTaskProgram = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクのプログラムを表示')) {
    return false
  }
  if (!task.program) {
    message.channel.send(`IDが${task.id}のタスクにプログラムは登録されていません。`)
    return true
  }
  let text = '登録されているプログラムは以下の通りです。\n'

  const separatedProgram = task.program.match(/.{1,1500}/gms)
  text += '```js\n'
  text += separatedProgram.shift()
  text += '\n```'
  message.channel.send(text)

  separatedProgram.forEach(program => {
    message.channel.send('```js\n' + program + '\n```')
  })

  return true
}
