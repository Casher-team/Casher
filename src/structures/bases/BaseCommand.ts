import { Collection, Permissions } from "discord.js"
import { defaultCommandCooldownTime, defaultCommandCooldownUsageLimit } from '../../../config.json'
import { ICommandConfig, ICommandConfigReleasesNotesValues, ICommandParams, ICommandData, ICommandExecParams } from './BaseCommand.types'

defaultCommandCooldownTime as number
defaultCommandCooldownUsageLimit as number

class BaseCommand {
  config: ICommandConfig
  data: ICommandData
  props?: object
  exec?: (params: ICommandExecParams) => void

  constructor({ config, data, props }: ICommandParams) {
    if (typeof config.aliases === 'string') config.aliases = [config.aliases]
    if (typeof config.categories === 'string') config.categories = [config.categories]
    if (!config.cooldown) config.cooldown = { time: defaultCommandCooldownTime, usageLimit: defaultCommandCooldownUsageLimit }
    if (typeof config.cooldown === 'number') config.cooldown = { time: config.cooldown, usageLimit: defaultCommandCooldownUsageLimit }
    if (config.permissions) {
      config.permissions.client = config.permissions.client ?? new Permissions()
      config.permissions.member = config.permissions.member ?? new Permissions()
      
      config.permissions.client.add(config.permissions.both || 0)
      config.permissions.member.add(config.permissions.both || 0)
    }

    const releasesNotesEntries = config.releasesNotes?.map((release, version) => {
      const entry: [string, ICommandConfigReleasesNotesValues] = [
        version,
        {
          version: release.version || version,
          name: release.name,
          description: release.description,
          createdAt: release.createdAt ?? new Date(release.createdTimestamp),
          createdTimestamp: release.createdTimestamp
        }
      ]

      return entry
    })

    this.data = data
    this.props = props // Apenas para receber os valores das chaves das props

    this.exec?.({
      args: this.data.args,
      client: this.data.client,
      lang: 'pt-br',
      message: this.data.message,
      texts: (textId: string | number, textData?: object) => {
        return 'a'
      },
      props: this.props
    })

    this.config = {
      name: config.name,
      aliases: config.aliases ?? [],
      description: config.description,
      categories: config.categories,
      cooldown: {
        time: config.cooldown.time ?? defaultCommandCooldownTime,
        usageLimit: config.cooldown.usageLimit ?? 1
      },
      isActive: config.isActive ?? true,
      reasonInactivity: config.reasonInactivity,
      createdAt: config.createdAt ?? new Date(config.createdTimestamp),
      createdTimestamp: config.createdTimestamp,
      lastUpdateAt: config.lastUpdateAt ?? new Date(config.lastUpdateTimestamp),
      lastUpdateTimestamp: config.lastUpdateTimestamp,
      version: config.version,
      releasesNotes: new Collection(releasesNotesEntries),
      permissions: {
        client: config.permissions?.client ?? new Permissions(),
        member: config.permissions?.member ?? new Permissions()
      }
    }


  }
}

export { BaseCommand }