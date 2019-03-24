export interface Downloader {
  latest(addon: string): Promise<void>
}
