import { AsyncSubject } from 'rxjs'

import { Game } from '../Games/Game'
import { MonitorEvent } from './MonitorEvent'

export class Monitor extends AsyncSubject<MonitorEvent> {
  constructor(public readonly game: Game) {
    super()
  }
}
