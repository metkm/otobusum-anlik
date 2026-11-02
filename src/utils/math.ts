export const dampen = (value: number) => {
  'worklet'
  return 8 * Math.log(value + 1)
}

export const alignCenter = (viewSize: number, snapSize: number) => {
  'worklet'
  return (viewSize - snapSize) / 2
}
