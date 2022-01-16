import { TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { Article } from '../entity/Article'
import { DiscordChannel } from '../entity/DiscordChannel'
import { ScheduledTask } from '../entity/ScheduledTask'
import { getChannelEntity } from './get-channel-entity'

export const deleteChannel = async (channel: TextChannel): Promise<DiscordChannel> => {
  const channelE = await getChannelEntity(channel as TextChannel)

  await Promise.all(
    channelE.scheduledTasks.map(async task => {
      await getRepository(Article).delete({ task })
      await getRepository(ScheduledTask).remove(task)
    })
  )
  return getRepository(DiscordChannel).remove(channelE)
}
