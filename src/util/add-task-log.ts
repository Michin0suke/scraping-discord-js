import { format } from 'date-fns'
import { getRepository } from 'typeorm'
import { ScheduledTask } from '../entity/ScheduledTask'

export const addTaskLog = async (task: ScheduledTask, message: string): Promise<ScheduledTask> => {
  if (!task.log) task.log = ''
  task.log += `\n${format(new Date(), 'Y/MM/dd HH:mm:SS')} ${message}`
  if (task.log.length > 1500) task.log = task.log.slice(-1500)
  return getRepository(ScheduledTask).save(task)
}
