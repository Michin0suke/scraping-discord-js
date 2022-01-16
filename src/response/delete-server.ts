import { Message } from 'discord.js'
import { getRepository } from 'typeorm'
import { Article } from '../entity/Article'
import { DiscordChannel } from '../entity/DiscordChannel'
import { DiscordServer } from '../entity/DiscordServer'
import { ScheduledTask } from '../entity/ScheduledTask'

const deleteArticleEntity = async (article: Article): Promise<Article> => {
  return await getRepository(Article).remove(article)
}

const deleteTaskEntity = async (task: ScheduledTask): Promise<ScheduledTask> => {
  await Promise.all(task.articles.map(i => deleteArticleEntity(i)))
  return await getRepository(ScheduledTask).remove(task)
}

const deleteChannelEntity = async (channel: DiscordChannel): Promise<DiscordChannel> => {
  await Promise.all(channel.scheduledTasks.map(i => deleteTaskEntity(i)))
  return await getRepository(DiscordChannel).remove(channel)
}

const deleteServerEntity = async (server: DiscordServer): Promise<DiscordServer> => {
  await Promise.all(server.channels.map(i => deleteChannelEntity(i)))
  return await getRepository(DiscordServer).remove(server)
}

export const deleteServer = async (
  message: Message
): Promise<boolean> => {
  if (!message.content.match(/^(このサーバを削除)/)) {
    return false
  }

  const serverE = await getRepository(DiscordServer).findOne(message.guild.id, {
    relations: ['channels', 'channels.scheduledTasks', 'channels.scheduledTasks.articles']
  })
  if (!serverE) {
    message.channel.send('このサーバのデータは存在しません。')
    return
  }

  await deleteServerEntity(serverE)

  message.channel.send('このサーバとチャンネル、紐付けられたタスクのデータを全て削除しました。')

  return true
}
