import { fs } from '@nofrills/fs'

import { Game } from './Game'

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
}
