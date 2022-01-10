import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { DiscordChannel } from '../entity/DiscordChannel'
import { ScheduledTask } from '../entity/ScheduledTask'
import { getChannelEntity } from '../util/get-channel-entity'

export const addTask = async (
  message: Message
): Promise<boolean> => {
  const taskDescriptionMatch = message.content.match(/.+(?=するタスクを(追加|作成|登録))/)

  if (!taskDescriptionMatch) {
    return false
  }

  if (!(await getRepository(DiscordChannel).findOne())) {
    message.channel.send('最初に`init`コマンドを実行してください。')
    return true
  }

  if (message.content.match(/〜するタスクを(追加|作成|登録)/)) {
    message.channel.send(
      '〜の部分には、タスクの説明を付与してください。\n' +
      '例)\n' +
      '* example.comから最新の記事を取得して表示するタスクを追加\n' +
      '* キーワード「猫」のGoogle検索結果を取得して表示するタスクを追加'
    )
    return true
  }

  const taskDescription = taskDescriptionMatch[0]

  const task = new ScheduledTask()
  const channel = await getChannelEntity(message.channel)
  if (!channel) {
    message.channel.send('このチャンネルは登録されていません。\n' + '最初にチャンネルの登録を行ってください。')
    return true
  }
  task.channel = channel
  task.description = taskDescription + 'する'
  const savedTask = await getRepository(ScheduledTask).save(task)

  message.channel.send(`${taskDescription}するタスクを追加しました。IDは${savedTask.id}です。\n作成したタスクにプログラムを追加してから、タスクを起動しましょう。\n追加したタスク一覧は\`ステータス\`コマンドで確認できます。`)

  return true
}
