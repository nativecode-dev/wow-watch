import { fs } from '@nofrills/fs'

import { GameMod } from './GameMod'

export abstract class Game {
  constructor(private readonly name: string, private readonly location: string) {}

  get gameName(): string {
    return this.name
  }

  get gameLocation(): string {
    return this.location
  }

  abstract get modLocation(): string
  abstract get settingsLocation(): string

  abstract getMods(): Promise<GameMod[]>

  async validate(): Promise<boolean> {
    const requiredDirs = [this.gameLocation, this.modLocation, this.settingsLocation]
    const requiredDirsExist = await Promise.all(requiredDirs.map(dir => fs.exists(dir)))

    if (requiredDirsExist.some(x => x === false)) {
      return false
    }

    return true
  }
}
