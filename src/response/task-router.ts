import { Client, Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../entity/ScheduledTask'
import { zenkaku2Hankaku } from '../util/zenkaku2hankaku'
import { addProgram } from './task/add-program'
import { deleteProgram } from './task/delete-program'
import { deleteTask } from './task/delete-task'
import { disableTask } from './task/disable-task'
import { enableTask } from './task/enable-task'
import { runTask } from './task/run-task'
import { setTaskInterval } from './task/set-task-interval'
import { showTaskLog } from './task/show-log'
import { showTaskProgram } from './task/show-program'
import { showTaskDetail } from './task/show-task-detail'

export const taskRouter = async (
  client: Client,
  message: Message
): Promise<boolean> => {
  const match = message.content.match(/^IDが.+のタスク.+/i)
  if (!match) {
    return false
  }

  const strTaskId = zenkaku2Hankaku(message.content.match(/(?<=IDが).+(?=のタスク.+)/i)[0])
  const taskId = parseInt(strTaskId, 10)
  if (!taskId) {
    message.channel.send('taskIDは整数で指定する必要があります。')
    return true
  }

  const task = await getRepository(ScheduledTask).findOne(
    {
      where: { id: taskId },
      relations: ['channel', 'articles']
    })
  if (!task) {
    message.channel.send(`IDが${taskId}のタスクは存在しません。`)
    return true
  }

  // タスクを削除
  if (await deleteTask(message, task)) return true
  // タスクを起動
  if (await enableTask(client, message, task)) return true
  // タスクを停止
  if (await disableTask(message, task)) return true
  // タスクを実行
  if (await runTask(message, task)) return true
  // タスクの詳細を表示
  if (await showTaskDetail(message, task)) return true
  if (await showTaskLog(message, task)) return true
  if (await showTaskProgram(message, task)) return true
  if (await deleteProgram(message, task)) return true

  // プログラムを追加
  if (await addProgram(message)) return true
  if (await setTaskInterval(message, task)) return true

  message.channel.send('コマンドを検出できませんでした。\n利用できるコマンド一覧は、`ヘルプ`で確認できます')
  return true
}
