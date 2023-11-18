import { Job, UpdateJob } from '@/types/jobs.type'

export const jobToUpdateJob = (job: Job): UpdateJob => {
  return {
    ...job,
  }
}
