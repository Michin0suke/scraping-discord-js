import { Message, TextChannel } from 'discord.js'
import { getRepository } from 'typeorm'
import { Article } from '../entity/Article'
import { DiscordChannel } from '../entity/DiscordChannel'
import { ScheduledTask } from '../entity/ScheduledTask'

export const unsubscribe = async (
  message: Message
): Promise<boolean> => {
  if (!message.content.match(/^(free|このチャンネルの登録を解除)/)) {
    return false
  }

  const thisChannel = message.channel as TextChannel
  const channel = await getRepository(DiscordChannel).findOne({
    where: { id: thisChannel.id },
    relations: ['scheduledTasks']
  })

  if (!channel) {
    thisChannel.send('このチャンネルは登録されていません。')
    return true
  }

  await Promise.all(
    channel.scheduledTasks.map(async task => {
      await getRepository(Article).delete({ task })
      await getRepository(ScheduledTask).remove(task)
    })
  )
  await getRepository(DiscordChannel).remove(channel)
  thisChannel.send('このチャンネルの連携を解除しました。')

  return true
}
