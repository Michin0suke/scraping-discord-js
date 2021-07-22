import { DMChannel, NewsChannel, TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'

export const getChannelEntity = async (channel: TextChannel | DMChannel | NewsChannel): Promise<DiscordChannel | undefined> => {
  return getRepository(DiscordChannel)
    .createQueryBuilder('channel')
    .leftJoinAndMapMany('channel.scheduledTasks', 'channel.scheduledTasks', 'scheduledTasks')
    .leftJoinAndMapMany('scheduledTasks.articles', 'scheduledTasks.articles', 'articles')
    .where({ id: channel.id })
    .getOne()
}
