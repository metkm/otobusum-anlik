export type RouteDirection = 'G' | 'D'
export type RouteCode = `${string}_${RouteDirection}_${string}`

export interface LineGroup {
  id: number
  name: string
  codes: Set<string>
}
