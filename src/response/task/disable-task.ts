import { Message } from 'discord.js'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { stopTask } from '../../util/stop-task'

export const disableTask = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクを停止')) {
    return false
  }
  stopTask(task)
  message.channel.send(`IDが${task.id}のタスクを停止しました。`)
  return true
}
