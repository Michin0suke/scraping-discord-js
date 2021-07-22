import { Message } from 'discord.js'
import { ScheduledTask } from '../../entity/ScheduledTask'
import { runCode } from '../../util/run-code'

export const runTask = async (message: Message, task: ScheduledTask): Promise<boolean> => {
  if (!message.content.match(/タスクを(一|1|１).*度.*実行/)) {
    return false
  }
  const program = task.program
  if (!task.program) {
    message.channel.send(`IDが${task.id}のタスクには、プログラムが設定されていません。`)
    return true
  }
  try {
    const result = await runCode(program)
    if (result) message.channel.send(JSON.stringify(result, null, 4))
    message.channel.send('正常に実行が終了しました。')
  } catch (e) {
    message.channel.send(`IDが${task.id}のタスクのプログラム実行時にエラーが発生しました。(${e})`)
  }
  return true
}
