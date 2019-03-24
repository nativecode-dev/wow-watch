import { fs } from '@nofrills/fs'

export class Manager {
  constructor(private readonly addons: string) {}

  async manifest(addon: string): Promise<string> {
    const tocfile = fs.join(this.addons, addon, `${fs.basename(addon)}.toc`)
    await this.assert(tocfile)
    return fs.text(tocfile)
  }

  async scan(): Promise<string[]> {
    await this.assert(this.addons)
    const addons = await fs.list(this.addons)
    return addons.map(addon => fs.join(this.addons, addon))
  }

  private async assert(path: string): Promise<void> {
    const exists = await fs.exists(path)

    if (exists === false) {
      new Error(`"${path}" does not exist`)
    }
  }
}
