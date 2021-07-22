import { Client } from 'discord.js'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../entity/ScheduledTask'
import { runScheduledTask } from './run-scheduled-task'

export const startTask = async (client: Client, task: ScheduledTask): Promise<ScheduledTask> => {
  task.status = 'running'
  const savedTask = await getRepository(ScheduledTask).save(task)
  runScheduledTask(client, task.id)
  return savedTask
}
