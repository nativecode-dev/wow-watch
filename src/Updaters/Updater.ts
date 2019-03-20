import { AsyncSubject } from 'rxjs'

export enum UpdateEvents {
  ModUpdate = 'update-mod',
}

export interface UpdateEvent {
  event: UpdateEvents
}

export class Updater extends AsyncSubject<UpdateEvent> {}
