import { Client, Message } from 'discord.js'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { startTask } from '../../util/start-task'

export const enableTask = async (client: Client, message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match(/タスクを(起動|実行|スタート)/)) {
    return false
  }

  if (!task.program) {
    message.channel.send(`IDが${task.id}のタスクにはプログラムが登録されていません。`)
    return true
  }

  startTask(client, task)
  message.channel.send(`IDが${task.id}のタスクを起動しました。`)
  return true
}
