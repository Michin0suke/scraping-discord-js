import { Message, TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'

export const unsubscribe = async (
  message: Message
): Promise<boolean> => {
  if (!message.content.match(/^(free|このチャンネルの登録を解除)/)) {
    return false
  }

  const thisChannel = message.channel as TextChannel
  const channel = await getRepository(DiscordChannel).findOne({ id: thisChannel.id })

  if (!channel) {
    thisChannel.send('このチャンネルは登録されていません。')
    return true
  }

  getRepository(DiscordChannel).remove(channel)
  thisChannel.send('連携を解除しました。')

  return true
}
