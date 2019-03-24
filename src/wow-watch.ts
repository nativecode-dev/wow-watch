import { Manager } from './Manager'

const gamepath = `/home/mpham/games/battle.net/drive_c/Program Files (x86)/World of Warcraft/_retail_/Interface/AddOns`

async function main(): Promise<void> {
  const manager = new Manager(gamepath)
  const directories = await manager.scan()
  const manifests = await Promise.all(directories.map(directory => manager.manifest(directory)))
  console.log(...manifests)
}

main().catch(console.log)
