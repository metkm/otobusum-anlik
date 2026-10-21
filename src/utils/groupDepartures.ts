export const groupDeparturesByHour = (values: `${number}:${number}:${number}`[]) => {
  const result = {} as Record<string, string[]>

  for (const value of values) {
    const hour = value.split(':').at(0)
    const minute = value.split(':').at(1)

    if (hour && minute && result[hour]) {
      result[hour].push(minute)
      result[hour].sort()
    } else if (hour && minute) {
      result[hour] = [minute]
    }
  }

  return result
}
