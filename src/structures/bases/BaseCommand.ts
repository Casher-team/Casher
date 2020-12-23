import { Collection, Message } from "discord.js"
import { NewClient } from "../NewClient"
import { defaultCommandCooldownTime, defaultCommandCooldownUsageLimit } from '../../../config.json'

defaultCommandCooldownTime as number
defaultCommandCooldownUsageLimit as number

interface ICommandConfigReleasesNotesValuesParams {
  version?: string
  name: string
  description: string
  createdAt?: Date
  createdTimestamp: number
}

interface ICommandConfigReleasesNotesValues extends ICommandConfigReleasesNotesValuesParams {
  version: string
  createdAt: Date
}

interface ICommandConfigParams {
  name: string
  aliases?: string[] | string
  description?: string
  categories: string[] | string
  cooldown?: {
    time?: number
    usageLimit?: number
  } | number
  isActive?: boolean
  reasonInactivity?: string
  createdAt?: Date
  createdTimestamp: number
  lastUpdateAt?: Date
  lastUpdateTimestamp: number
  version: string
  releasesNotes?: Collection<string, ICommandConfigReleasesNotesValuesParams>
}

interface ICommandConfig extends ICommandConfigParams {
  aliases: string[]
  categories: string[]
  cooldown: {
    time: number
    usageLimit: number
  }
  isActive: boolean
  createdAt: Date
  lastUpdateAt: Date
  releasesNotes: Collection<string, ICommandConfigReleasesNotesValues>
}

interface ICommandParams {
  config: ICommandConfigParams, 
  run: (params: { client?: NewClient, message?: Message, args?: string[]}) => void
}

class BaseCommand {
  config: ICommandConfig
  run: (params: { client?: NewClient, message?: Message, args?: string[]}) => void

  constructor({ config, run }: ICommandParams) {
    if (typeof config.aliases === 'string') config.aliases = [config.aliases]
    if (typeof config.categories === 'string') config.categories = [config.categories]
    if (!config.cooldown) config.cooldown = { time: defaultCommandCooldownTime, usageLimit: defaultCommandCooldownUsageLimit }
    if (typeof config.cooldown === 'number') config.cooldown = { time: config.cooldown, usageLimit: defaultCommandCooldownUsageLimit }

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
      releasesNotes: new Collection(releasesNotesEntries)
    }

    this.run = run
  }
}