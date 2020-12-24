import { Collection, Client } from 'discord.js'
import { BaseCommand } from './bases/BaseCommand'
import { BaseEvent } from './bases/BaseEvent'
import { Langs } from './NewClient.types.'

class NewClient extends Client {
  events: Collection<string, BaseEvent[]>
  commands: Collection<string, BaseCommand>
  aliases: Collection<string, BaseCommand>
  lang: Langs
  defaultCommandCooldownTime: number
  defaultCommandCooldownUsageLimit: number

  constructor() {
    super()

    this.events = new Collection()
    this.commands = new Collection()
    this.aliases = new Collection()
    this.lang = 'pt-br'
    this.defaultCommandCooldownTime = 0
    this.defaultCommandCooldownUsageLimit = 1
  }
}

export { NewClient }