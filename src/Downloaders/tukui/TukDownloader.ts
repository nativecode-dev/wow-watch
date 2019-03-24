import { Downloader } from '../Downloader'

export class TukDownloader implements Downloader {
  latest(addon: string): Promise<void> {
    return Promise.reject()
  }
}
