import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../../entity/ScheduledTask'

export const deleteTask = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクを削除')) {
    return false
  }
  const taskId = task.id
  await getRepository(ScheduledTask).remove(task)
  message.channel.send(`IDが${taskId}のタスクを削除しました。`)
  return true
}
