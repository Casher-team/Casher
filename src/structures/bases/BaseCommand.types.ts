import { Collection, Message, Permissions } from "discord.js";
import { NewClient } from "../NewClient";
import { Langs } from "../NewClient.types.";

export interface ICommandConfigReleasesNotesValuesParams {
  version?: string
  name: string
  description: string
  createdAt?: Date
  createdTimestamp: number
}

export interface ICommandConfigReleasesNotesValues extends ICommandConfigReleasesNotesValuesParams {
  version: string
  createdAt: Date
}

export interface ICommandConfigParams {
  id: number
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
  permissions?: {
    client?: Permissions
    member?: Permissions
    both?: Permissions
  }
}

export interface ICommandConfig extends ICommandConfigParams {
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
  permissions: {
    client: Permissions,
    member: Permissions
  }
}

export interface ICommandData {
  client: NewClient
  message: Message
  args: string[]
}

export interface ICommandParams {
  config: ICommandConfigParams
  data: ICommandData
  props?: object
}

export interface ICommandExecParams {
  client: NewClient
  message: Message
  args: string[]
  props?: object
  lang: Langs
  texts: (textId: string | number, textData?: object) => string
}

export type ICommandPropTypes =
  | 'command'
  | 'text'
  | 'member'
  | 'number'
  | 'string'
  | 'content'
  | 'channel'

export interface ICommandProp {
  name: string
  text: string
  type: ICommandPropTypes
  position?: number
  required?: boolean
  maxLength?: number
  minLength?: number
  joinSpace?: boolean
  length?: number
}