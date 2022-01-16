import { Message, TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { getChannelEntity } from '../../util/get-channel-entity'

export const changeChannel = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクをこのチャンネルに紐付け')) {
    return false
  }
  const thisChannel = await getChannelEntity(message.channel as TextChannel)
  task.channel = thisChannel
  await getRepository(ScheduledTask).save(task)
  message.channel.send(`IDが${task.id}のタスクをこのチャンネルに紐付けしました。`)
  return true
}
