import { Message } from 'discord.js'
import { ScheduledTask } from '../../entity/ScheduledTask'

export const showTaskLog = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクのログを表示')) {
    return false
  }
  if (!task.log) {
    message.channel.send(`IDが${task.id}のタスクには、ログが存在しません。`)
    return true
  }
  message.channel.send(
    `IDが${task.id}のタスクのログは以下の通りです。\n\n` +
    '```\n' +
    task.log.slice(-1000) +
    '```\n\n' +
    '※最新の1000文字のみ表示しています。'
  )
  return true
}
