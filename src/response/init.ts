import { Message, TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'
import { DiscordServer } from '../entity/DiscordServer'
import { table } from '../util/textTable'

export const init = async (message: Message): Promise<boolean> => {
  if (!message.content.match(/^(init|このチャンネルを登録)/)) {
    return false
  }

  const thisChannel = message.channel as TextChannel

  if (await getRepository(DiscordChannel).findOne({ id: thisChannel.id })) {
    thisChannel.send('このチャンネルはすでに登録されています。')
    return true
  }

  const channel = new DiscordChannel()
  const server = new DiscordServer()

  channel.id = thisChannel.id
  channel.name = thisChannel.name

  server.id = message.guild.id
  server.name = message.guild.nameAcronym
  channel.server = server

  const savedChannelEntity = await getRepository(DiscordChannel).save(channel)

  if (savedChannelEntity) {
    thisChannel.send(
      '以下の内容で登録しました。\n' +
        '```\n' +
        table([
          ['サーバＩＤ', `${message.guild.nameAcronym}`],
          ['サーバ名', `${message.guild.id}`],
          ['チャンネルＩＤ', `${thisChannel.id}`],
          ['チャンネル名', `${thisChannel.name}`]
        ]).replace(/ /g, '　') +
        '```'
    )
  } else {
    thisChannel.send('データの登録に失敗しました。')
  }
  return true
}
