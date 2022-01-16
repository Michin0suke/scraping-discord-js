import { TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'
import { saveChannel } from './save-channel'

export const getChannelEntity = async (channel: TextChannel): Promise<DiscordChannel | undefined> => {
  const channelE = await getRepository(DiscordChannel)
    .findOne(channel.id, { relations: ['server', 'scheduledTasks', 'scheduledTasks.articles'] })
  if (!channelE) {
    return saveChannel(channel)
  }
  return channelE
}
