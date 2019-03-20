import { Is } from '@nofrills/types'

import { fromBuffer, fromFd, ZipFile, Entry } from 'yauzl'
import { fs } from '@nofrills/fs'
import { CallbackReturn } from './Callback'
import { Readable } from 'stream'
import { createWriteStream, WriteStream } from 'fs'

export type UnzipCallback = CallbackReturn<[Entry, EntryType], Promise<boolean | WriteStream>>

export enum EntryType {
  Directory = 'directory',
  File = 'file',
}

export type ZipSource = Buffer | number

export class Unzip {
  static async fromBuffer(buffer: Buffer): Promise<Unzip> {
    return new Unzip(buffer)
  }

  static async fromFile(zipfile: string): Promise<Unzip> {
    const descriptor = await fs.open(zipfile, 'r')
    return new Unzip(descriptor)
  }

  private readonly source: Promise<ZipFile>

  constructor(source: ZipSource) {
    this.source = this.resolveSource(source)
  }

  getZipFile(): Promise<ZipFile> {
    return this.source
  }

  async unzip(path: string): Promise<string[]> {
    const zip = await this.source
    const entries = await this.unzipEntries(path, async ([entry, type]) => {
      const filename = fs.join(path, entry.fileName)

      if (type === EntryType.File) {
        const stream = await this.openReadStreamAsync(zip, entry)
        const writable = createWriteStream(filename)
        return stream.pipe(writable)
      }

      return await fs.mkdirp(fs.join(path, entry.fileName))
    })

    return entries.map(entry => fs.join(path, entry.fileName))
  }

  async unzipEntries(path: string, callback: UnzipCallback): Promise<Entry[]> {
    const zip = await this.source

    return new Promise((resolve, reject) => {
      const entries: Entry[] = []
      zip.readEntry()

      zip.on('entry', entry => {
        const type = entry.fileName.endsWith('/') ? EntryType.Directory : EntryType.File

        if (callback([entry, type])) {
          entries.push(entry)
        }

        zip.readEntry()
      })

      zip.once('error', error => reject(error))
      zip.once('end', () => resolve(entries))
    })
  }

  private resolveSource(source: ZipSource): Promise<ZipFile> {
    return new Promise((resolve, reject) => {
      const handler = (error: Error | undefined, zipfile: ZipFile | undefined) => {
        if (error) {
          reject(error)
        } else if (zipfile) {
          resolve(zipfile)
        } else {
          reject(new Error('source returned undefined'))
        }
      }

      if (Is.number(source)) {
        fromFd(source as number, (error, zipfile) => handler(error, zipfile))
      } else {
        fromBuffer(source as Buffer, (error, zipfile) => handler(error, zipfile))
      }
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
          reject(new Error('stream was undefined'))
        }
      })
    })
  }
}
