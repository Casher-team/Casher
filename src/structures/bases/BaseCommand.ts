import { Collection, Message } from "discord.js";
import { NewClient } from "../NewClient";

interface ICommandConfigParams {
  name: string
  aliases?: string[] | string
  description?: string
  categories: string[] | string
  cooldown?: {
    time: number
    usageLimit?: number
  } | number
  active?: boolean
  reasonInactivity?: string
  createdAt?: Date
  createdTimestamp: number
  lastUpdateAt?: Date
  lastUpdateTimestamp: number
  version: string
  releasesNotes: Collection<string, {
    version: string
    name: string
    description: string
    createdAt?: Date
    createdTimestamp: number
  }>
}

interface ICommandConfig extends ICommandConfigParams {
  cooldown: {
    time: number
    usageLimit: number
  }
  active: boolean
  createdAt: Date
  lastUpdateAt: Date
  releasesNotes: Collection<string, {
    version: string
    name: string
    description: string
    createdAt: Date
    createdTimestamp: number
  }>
}



interface IConstructorParams {
  config: ICommandConfig
  run: (params: {
    client?: NewClient
    message?: Message
    args?: string[]
  }) => void
}

class BaseCommand {
  config: ICommandConfig
  constructor({ config, run }: { config: ICommandConfigParams, run(params: { client?: NewClient, message?: Message, args?: string[]}): void }) {
    this.config.releasesNotes.forEach(x => x.)
  }
}