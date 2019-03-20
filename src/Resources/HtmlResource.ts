import fetch from 'node-fetch'

import { createWriteStream } from 'fs'
import { load } from 'cheerio'
import { fromBuffer, ZipFile, Entry, ZipFileOptions } from 'yauzl'

import { ResourceBase } from './ResourceBase'
import { ResourceInfo } from './ResourceInfo'
import { ResourceVersion } from './ResourceVersion'
import { fs } from '@nofrills/fs'
import { Readable } from 'stream'

export type SelectResourceInfo = (cheerio: Cheerio) => ResourceInfo

export class HtmlResource extends ResourceBase {
  name: string
  url: string

  constructor(private readonly selector: string, private readonly selection: SelectResourceInfo) {
    super()
  }

  async check(): Promise<ResourceInfo> {
    const cheerio = await this.getHtml(this.url)
    return this.getSelected(cheerio)
  }

  async download(version: ResourceVersion): Promise<Buffer> {
    const response = await fetch(version.url)
    return response.buffer()
  }

  async unarchive(buffer: Buffer, location: string): Promise<string[]> {
    const descriptor = await fs.open('', 'w+')
    const written = await fs.write(descriptor, buffer)

    if (written <= 0) {
      throw Error(`failed to unarchive ${location}`)
    }

    const zipfile = await this.fromBufferAsync(buffer)
    return this.unzipAsync(location, zipfile)
  }

  private async getHtml(url: string): Promise<CheerioStatic> {
    const response = await fetch(url)
    const buffer = await response.buffer()
    return load(buffer)
  }

  private getSelected(cheerio: CheerioStatic): ResourceInfo {
    return this.selection(cheerio(this.selector))
  }

  private fromBufferAsync(buffer: Buffer): Promise<ZipFile> {
    return new Promise((resolve, reject) => {
      fromBuffer(buffer, (error, file) => {
        if (error) {
          reject(error)
        } else if (file) {
          resolve(file)
        } else {
          reject(file)
        }
      })
    })
  }

  private unzipAsync(location: string, zip: ZipFile): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const files: string[] = []
      zip.readEntry()
      zip.on('entry', async (entry: Entry) => {
        files.push(entry.fileName)

        if (entry.fileName.endsWith('/')) {
          zip.readEntry()
          return
        }

        const filename = fs.join(location, entry.fileName)
        const stream = await this.openReadStreamAsync(zip, entry)
        stream.pipe(createWriteStream(filename))
      })
      zip.once('end', () => resolve(files))
    })
  }

  private openReadStreamAsync(zip: ZipFile, entry: Entry): Promise<Readable> {
    return new Promise((resolve, reject) => {
      zip.openReadStream(entry, (error, stream) => {
        if (error) {
          reject(error)
        } else if (stream) {
          resolve(stream)
        } else {
          reject(stream)
        }
      })
    })
  }
}
