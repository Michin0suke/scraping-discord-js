import { Client, Message } from 'discord.js'

export const hello = async (client: Client, message: Message): Promise<boolean> => {
  if (!message.content.match(/^(hello|こんにちは)/)) {
    return false
  }
  message.channel.send(
    `${message.author.username}さん、こんにちは！\n` +
    `${client.user.username}です。よろしくお願いします！`
  )
  return true
}
