import 'mocha-typescript'
import expect from '../expect'

import { fs } from '@nofrills/fs'

import { Unzip } from '../../src/Utils/Unzip'

@suite
class WhenUsingUnzip {
  private readonly zipdir = fs.join(__dirname, '../.assets/.cache/result-zip')
  private readonly zipfile = fs.join(__dirname, '../.assets/result.zip')

  @test
  async shouldListEntries() {
    const zip = await Unzip.fromFile(this.zipfile)
    const entries = await zip.unzipEntries()
    expect(entries.map(entry => entry.fileName)).contains('data.sql')
  }

  @test
  async shouldUnzipFiles() {
    await fs.mkdirp(this.zipdir)
    const zip = await Unzip.fromFile(this.zipfile)
    const files = await zip.unzip(this.zipdir)
    expect(files.map(file => fs.basename(file))).contains('data.sql')
  }
}
