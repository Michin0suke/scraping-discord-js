import { getRepository } from 'typeorm'
import { ScheduledTask } from '../entity/ScheduledTask'

export const stopTask = async (task: ScheduledTask): Promise<ScheduledTask> => {
  task.status = 'stopped'
  return getRepository(ScheduledTask).save(task)
}
