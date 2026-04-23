export const groupDeparturesByHour = (values: `${number}:${number}:${number}`[]) => {
  const result = {} as Record<string, string[]>

  for (let index = 0; index < values.length; index++) {
    const value = values[index]
    if (!value) continue

    const hour = value.split(':').at(0)
    if (!hour) continue

    const minute = value.split(':').at(1)
    if (!minute) continue

    if (result[hour]) {
      result[hour].push(minute)
      result[hour].sort()
    } else {
      result[hour] = [minute]
    }
  }

  return result
}
