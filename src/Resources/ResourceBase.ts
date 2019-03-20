import { fs } from '@nofrills/fs'

import { Resource } from './Resource'
import { ResourceInfo } from './ResourceInfo'
import { ResourceVersion } from './ResourceVersion'

export abstract class ResourceBase implements Resource {
  abstract name: string
  abstract url: string

  abstract check(): Promise<ResourceInfo>
  abstract download(version: ResourceVersion): Promise<Buffer>
  abstract unarchive(buffer: Buffer, location: string): Promise<string[]>

  async replace(source: string, target: string): Promise<void> {
    const sourceExists = await fs.exists(source)
    const targetExists = await fs.exists(target)

    if (sourceExists === false) {
      throw Error(`source does not exist: ${source}`)
    }

    if (targetExists === false) {
      throw Error(`target does not exist: ${target}`)
    }
  }
}
