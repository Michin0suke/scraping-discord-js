import { Message, TextChannel } from 'discord.js'
import { getChannelEntity } from '../util/get-channel-entity'
import { table } from '../util/textTable'

export const statusInChannel = async (
  message: Message
): Promise<boolean> => {
  if (!message.content.match(/^このチャンネル.*タスク.*一覧.*表示/)) {
    return false
  }

  const channel = await getChannelEntity(message.channel as TextChannel)

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
