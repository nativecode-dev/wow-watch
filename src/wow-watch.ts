import { Monitor } from './Monitors/Monitor'
import { WorldOfWarcraft } from './Games/WorldOfWarcraft'

const location = '/home/mpham/games/wine/battle-net/drive_c/Program Files (x86)/World of Warcraft'

const wow = new WorldOfWarcraft(location)
const monitor = new Monitor(wow)

