import { Collection, Client } from 'discord.js'
import { BaseCommand } from './bases/BaseCommand'
import { BaseEvent } from './bases/BaseEvent'

class NewClient extends Client {
  events: Collection<string, BaseEvent[]>
  commands: Collection<string, BaseCommand>
  aliases: Collection<string, BaseCommand>
  
  constructor() {
    super()

    this.events = new Collection()
    this.commands = new Collection()
    this.aliases = new Collection()
  }
}

export { NewClient }