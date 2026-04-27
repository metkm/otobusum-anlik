export type RouteDirection = 'G' | 'D'
export type RouteCode = `${string}_${RouteDirection}_${string}`

export interface LineGroup {
  id: string
  name: string
  codes: string[]
}
