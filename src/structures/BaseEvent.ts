import { NewClient } from "./Client";

interface IConstructorParams {
  listeners?: string[] | string
  run?: (client: NewClient, ...params: any) => void
}

class BaseEvent {
  listeners?: string[]
  run: (client: NewClient, ...params: any) => void

  constructor({ listeners, run }: IConstructorParams) {
    if (!listeners) listeners = undefined
    if (typeof listeners === 'string') listeners = [listeners]

    this.listeners = listeners
    
    if (!run) run = (client) => {}

    this.run = run
  }
}

export { BaseEvent }