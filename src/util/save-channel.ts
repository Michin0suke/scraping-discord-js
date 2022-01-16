import { TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'
import { DiscordServer } from '../entity/DiscordServer'

export const saveChannel = async (channel: TextChannel): Promise<DiscordChannel> => {
  const aChannel = new DiscordChannel()
  const server = new DiscordServer()

  aChannel.id = channel.id
  aChannel.name = (channel as TextChannel).name

  server.id = channel.guild.id
  server.name = channel.guild.nameAcronym
  aChannel.server = server

  await getRepository(DiscordServer).save(server)

  return getRepository(DiscordChannel).save(aChannel)
}
