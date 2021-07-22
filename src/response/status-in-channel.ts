import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'
import { table } from '../util/textTable'

export const statusInChannel = async (
  message: Message
): Promise<boolean> => {
  if (!message.content.match(/^このチャンネル.*タスク.*一覧.*表示/)) {
    return false
  }

  const channel = await getRepository(DiscordChannel)
    .createQueryBuilder('channel')
    .leftJoinAndMapMany('channel.scheduledTasks', 'channel.scheduledTasks', 'task')
    .leftJoinAndMapMany('task.articles', 'task.articles', 'article')
    .where('channel.id = :channelId', { channelId: message.channel.id })
    .getOne()

  if (!channel) {
    message.channel.send('チャンネルが登録されていません。')
    return true
  }

  const tableArr = [['チャンネル', 'タスクID', 'タスクの説明', 'ステータス', 'インターバル(分)']]

  if (channel) {
    const channelName = channel.name.slice(0, 8)

    if (channel.scheduledTasks.length === 0) {
      tableArr.push([channelName, 'ー', 'ー', 'ー', 'ー'])
    }

    channel.scheduledTasks.forEach(task => {
      tableArr.push([
        channelName,
        task.id.toString(),
        task.description.slice(0, 8),
        task.status,
        task.intervalMinutes.toString()
      ])
    })

    message.channel.send(
      '```\n' +
      table(tableArr) +
      '\n```'
    )
  } else {
    message.channel.send('このチャンネルは登録されていません。')
  }
  return true
}
