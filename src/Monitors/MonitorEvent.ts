import { Game } from '../Games/Game'

export enum MonitorEvents {
  Update = 'update',
}

export interface MonitorEvent {
  event: MonitorEvents
  game: Game
}
