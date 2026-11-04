import { Query } from '@tanstack/react-query'

export const getNextPollDelay = <T>(queryState: Query<T>['state'], duration: number) => {
  if (queryState.status !== 'success') {
    return
  }

  const nextPoll = (queryState.data as any)?.next_poll
  if (nextPoll) {
    return Math.max(0, nextPoll - Date.now())
  }

  const elapsed = Date.now() - queryState.dataUpdatedAt
  return Math.max(0, duration - elapsed)
}
