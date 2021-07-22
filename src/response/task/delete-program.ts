import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../../entity/ScheduledTask'

export const deleteProgram = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクのプログラムを削除')) {
    return false
  }
  task.program = null
  await getRepository(ScheduledTask).save(task)
  message.channel.send(`IDが${task.id}のタスクのプログラムを消去しました。`)
  return true
}
