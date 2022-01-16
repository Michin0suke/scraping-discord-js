import { Message, TextChannel } from 'discord.js'
import { deleteChannel } from '../util/delete-channel'

export const unsubscribe = async (
  message: Message
): Promise<boolean> => {
  if (!message.content.match(/^(free|このチャンネルを削除)/)) {
    return false
  }

  await deleteChannel(message.channel as TextChannel)
  message.channel.send('このチャンネルと紐づけられたタスクを全て削除しました。')

  return true
}
