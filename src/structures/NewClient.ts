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
  defaultCommandPropPosition: number

  constructor() {
    super()

    this.events = new Collection()
    this.commands = new Collection()
    this.aliases = new Collection()

    /* Definições de algumas variáveis do bot */

    this.lang = 'pt-br'                           // Idioma padrão do bot, para casos onde uma lingua não foi espécificada
    this.defaultCommandCooldownTime = 0           // Tempo padrão de cooldown para um comando do bot, caso ele não seja especificado na criação do mesmo
    this.defaultCommandCooldownUsageLimit = 1     // Número de vezes seguidas que um usuário pode usar um comando, dentro do tempo limite de cooldown sem que ele tenha restrições de uso
    this.defaultCommandPropPosition = 0           // O indice padrão que o bot usa para buscar o argumento quando não é especificado valor algum
  }
}

export { NewClient }