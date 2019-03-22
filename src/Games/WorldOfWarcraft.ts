import { fs } from '@nofrills/fs'

import { Game } from './Game'
import { GameMod } from './GameMod'

export class WorldOfWarcraft extends Game {
  constructor(location: string) {
    super('wow', location)
  }

  get modLocation(): string {
    return fs.join(this.gameLocation, '_retail_', 'Interface', 'AddOns')
  }

  get settingsLocation(): string {
    return fs.join(this.gameLocation, '_retail_', 'WTF')
  }

  getMods(): Promise<GameMod[]> {
    return Promise.reject()
  }
}
