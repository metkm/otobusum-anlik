import type { Line } from './line'
import type { Stop } from './stop'

export interface SearchResult {
  stops: Stop[]
  lines: Line[]
}
