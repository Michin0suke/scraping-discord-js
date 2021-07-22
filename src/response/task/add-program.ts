import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { zenkaku2Hankaku } from '../../util/zenkaku2hankaku'

export const addProgram = async (message: Message): Promise<boolean> => {
  if (!message.content.match(/^IDが.+のタスクに以下のプログラムを追加(\r\n|\n|\r).+$/sim)) {
    return false
  }

  const strTaskId = zenkaku2Hankaku(message.content.match(/(?<=IDが).+(?=のタスクに以下のプログラムを追加)/i)[0])
  const taskId = parseInt(strTaskId, 10)
  if (!taskId) {
    message.channel.send('taskIDは整数で指定する必要があります。')
    return true
  }

  const programMatch = message.content.match(/^(?<=IDが.+のタスクに以下のプログラムを追加(\r\n|\n|\r)+```(js|javascript)(\r\n|\n|\r)).+(?=(\r\n|\n|\r)+```)/sim)
  if (!programMatch) {
    message.channel.send('プログラムを検出できませんでした。プログラムは、以下の形式で記述してください。\n' +
    '```\n' +
    '`` `javascript\n' +
`return ([
{
  title: '記事タイトル1',
  url: 'https://example.com/article/1',
},
{
  title: '記事タイトル2',
  url: 'https://example.com/article/2',
}
])\n` +
    '`` `' +
    '```\n' +
    '※↑実際にはバッククート間のスペースは必要ありません。')
    return true
  }
  const program = programMatch[0]

  const task = await getRepository(ScheduledTask).findOne({ id: taskId })
  if (!task) {
    message.channel.send(`IDが${taskId}のタスクは存在しません。`)
    return true
  }

  if (task.program) {
    task.program += program
  } else {
    task.program = program
  }

  getRepository(ScheduledTask).save(task)

  message.channel.send(`IDが${taskId}の${task.description}タスクにプログラムを追加しました。\n` +
  '2000文字以上の長いプログラムの場合、このコマンドを繰り返すことで追記することができます。')

  return true
}
