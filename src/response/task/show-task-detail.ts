import { format } from 'date-fns'
import { Message } from 'discord.js'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { table } from '../../util/textTable'

const codeWrap = (text: string): string => {
  return (
    '```\n' + text + '\n```\n'
  )
}

export const showTaskDetail = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match('タスクの詳細を表示')) {
    return false
  }
  let text = codeWrap(table([
    ['ID', task.id.toString()],
    ['説明', task.description],
    ['登録先チャンネル名', task.channel.name],
    ['登録先チャンネルID', task.channel.id],
    ['取得済み記事数', task.articles.length.toString()],
    ['作成日時', format(new Date(task.createdAt), 'Y/MM/dd HH:mm:SS')],
    ['インターバル（分）', task.intervalMinutes.toString()],
    ['ステータス', task.status]
  ]))
  text += 'ログ（一部）\n'
  if (task.log) {
    text += codeWrap(task.log.slice(-100))
    text += `> 「IDが${task.id}のタスクのログを表示』コマンドで全てのログを表示できます。\n\n`
  } else {
    text += '> ログはありません。\n\n'
  }

  text += 'プログラム（一部）\n'

  if (!task.program) {
    text += '> プログラムは登録されていません。'
    message.channel.send(text)
    return true
  }

  text += '登録されているプログラムは以下の通りです。\n'
  text += codeWrap(task.program.slice(-100))
  text += `> 「IDが${task.id}のタスクのプログラムを表示』コマンドで全てのプログラムを表示できます。`

  message.channel.send(text)

  return true
}
