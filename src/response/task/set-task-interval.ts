import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { zenkaku2Hankaku } from '../../util/zenkaku2hankaku'

export const setTaskInterval = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  const minutesMatch = message.content.match(/(?<=タスクのインターバルを).+(?=分に(設定|変更))/)
  if (!minutesMatch) return false

  const intervalMinutes = parseInt(zenkaku2Hankaku(minutesMatch[0]), 10)
  console.log(zenkaku2Hankaku(minutesMatch[0]))
  console.log(intervalMinutes)
  if (!intervalMinutes) {
    message.channel.send('インターバルの分数は、1以上の整数である必要があります。')
    return true
  }

  if (intervalMinutes < 1) {
    message.channel.send('インターバルには、1分以上を設定する必要があります。')
    return true
  }

  task.intervalMinutes = intervalMinutes
  getRepository(ScheduledTask).save(task)

  message.channel.send(`IDが${task.id}のタスクのインターバルを${intervalMinutes}分に設定しました。`)
  return true
}
