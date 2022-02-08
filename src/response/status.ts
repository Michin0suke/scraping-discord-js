import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordServer } from '../entity/DiscordServer'
import { table } from '../util/textTable'

export const status = async (
  message: Message
): Promise<boolean> => {
  // TODO: みやすく
  if (!message.content.match(/^(status|状況|ステータス)/)) {
    return false
  }

  const server = await getRepository(DiscordServer)
    .createQueryBuilder('server')
    .leftJoinAndMapMany('server.channels', 'server.channels', 'channel')
    .leftJoinAndMapMany('channel.scheduledTasks', 'channel.scheduledTasks', 'task')
    .leftJoinAndMapMany('task.articles', 'task.articles', 'article')
    .where({ id: message.guild.id })
    .getOne()

  if (!server) {
    message.channel.send(
      'サーバにデータが存在しません。'
    )
    return true
  }

  const arr = [['チャンネル', 'タスクID', 'タスクの説明', 'ステータス', 'インターバル(分)']]

  if (server.channels.length !== 0) {
    server.channels.forEach(channel => {
      const channelName = channel.name.slice(0, 8)

      if (channel.scheduledTasks.length === 0) arr.push([channelName, 'ー', 'ー', 'ー', 'ー'])
      channel.scheduledTasks.forEach(task => {
        arr.push([
          channelName,
          task.id.toString(),
          task.description.slice(0, 8),
          task.status,
          task.intervalMinutes.toString()
        ])
      })
    })

    message.channel.send(
        `サーバID: ${message.guild.id}\n` +
        `サーバ名: ${message.guild.name}\n` +
        '```\n' +
        table(arr).replace(/ /g, '　') +
        '\n```'
    )
  } else {
    message.channel.send('このサーバのチャンネルにはタスクが登録されていません。')
  }
  return true
}
