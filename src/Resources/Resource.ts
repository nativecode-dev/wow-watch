import { ResourceInfo } from './ResourceInfo'
import { ResourceVersion } from './ResourceVersion'

export interface Resource {
  name: string
  url: string

  check(): Promise<ResourceInfo>
  download(version: ResourceVersion): Promise<Buffer>
  replace(source: string, target: string): Promise<void>
  unarchive(buffer: Buffer, location: string): Promise<string[]>
}
