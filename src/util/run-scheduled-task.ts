import { Client, TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { Article } from '../entity/Article'
import { DiscordChannel } from '../entity/DiscordChannel'
import { ScheduledTask } from '../entity/ScheduledTask'
import { addTaskLog } from './add-task-log'
import { runScrapCode } from './run-scrap-code'
import { stopTask } from './stop-task'

const MAX_SEND_AT_ONCE_ON_FIRST = 1
const MAX_SEND_AT_ONCE = 3

export const runScheduledTask = async (client: Client, taskId: number) => {
  const task = await getRepository(ScheduledTask).findOne({
    where: { id: taskId },
    relations: ['channel', 'articles']
  })
  if (!task) throw new Error(`IDが${taskId}のタスクは存在しません。`)
  if (task.status !== 'running') return

  const thisChannel = (client.channels.cache.get(task.channel.id) as TextChannel)

  // thisChannel.send(`IDが${taskId}のタスクを実行中（次は${task.intervalMinutes}分後`)

  try {
    const fetchedArticles = runScrapCode(task.program)

    if (!Array.isArray(fetchedArticles)) {
      thisChannel.send(`IDが${taskId}のタスクの実行時にエラーが発生したため、ステータスをstoppedに変更しました。\n詳しくはログを確認してください。`)
      const savedTask = await addTaskLog(task, '登録されたプログラムを実行したところ、配列以外のオブジェクトが返却されました。')
      stopTask(savedTask)
      return
    }

    const UrlsInDatabase = task.articles.map(article => article.url)

    const addedArticles = fetchedArticles.filter(article => (
      !UrlsInDatabase.includes(article.url)
    ))

    if (UrlsInDatabase.length === 0) {
      const latestArticle = addedArticles[-MAX_SEND_AT_ONCE_ON_FIRST]
      thisChannel.send(`${latestArticle.title}\n${latestArticle.url}`)
    } else {
      addedArticles.slice(-MAX_SEND_AT_ONCE).forEach(article => {
        thisChannel.send(`${article.title}\n${article.url}`)
      })
    }

    for (const addedArticle of addedArticles) {
      const article = new Article()
      article.task = task
      article.title = addedArticle.title
      article.url = addedArticle.url
      await getRepository(Article).save(article)
    }
  } catch (e) {
    thisChannel.send(`IDが${taskId}のタスクの実行時にエラーが発生したため、ステータスをstoppedに変更しました。\n詳しくはログを確認してください。`)
    const savedTask = await addTaskLog(task, e)
    stopTask(savedTask)
    return
  }

  const channelEntity = await getRepository(DiscordChannel).findOne()
  channelEntity.lastFetchedAt = new Date()
  getRepository(DiscordChannel).save(channelEntity)

  setTimeout(() => runScheduledTask(client, task.id), task.intervalMinutes * 1000 * 60)
}
