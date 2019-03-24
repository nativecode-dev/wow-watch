import { Downloader } from '../Downloader'

export class CurseDownloader implements Downloader {
  latest(addon: string): Promise<void> {
    return Promise.reject()
  }
}
