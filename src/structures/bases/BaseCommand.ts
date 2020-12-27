import { Collection, Message, MessageEmbed, Permissions } from "discord.js"
import { BasicAPIManager } from "../interfaces/basicAPIManager"
import { ICommandConfig, ICommandConfigReleasesNotesValues, ICommandParams, ICommandData, ICommandExecParams } from './BaseCommand.types'

class BaseCommand {
  config: ICommandConfig
  data: ICommandData
  props?: object
  exec?: (params: ICommandExecParams) => void
  basicAPIManager: BasicAPIManager

  constructor({ config, data, props }: ICommandParams) {
    if (typeof config.aliases === 'string') config.aliases = [config.aliases]
    if (typeof config.categories === 'string') config.categories = [config.categories]
    if (!config.cooldown) config.cooldown = { time: data.client.defaultCommandCooldownTime, usageLimit: data.client.defaultCommandCooldownUsageLimit }
    if (typeof config.cooldown === 'number') config.cooldown = { time: config.cooldown, usageLimit: data.client.defaultCommandCooldownUsageLimit }
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
    this.config = {
      id: config.id,
      name: config.name,
      aliases: config.aliases ?? [],
      description: config.description,
      categories: config.categories,
      cooldown: {
        time: config.cooldown.time ?? data.client.defaultCommandCooldownTime,
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

    const onThen = () => {
      this.exec?.({
        args: this.data.args,
        client: this.data.client,
        lang: data.client.lang,
        message: this.data.message,
        texts: translateText(this.config.id || this.config.name),
        props: this.props
      })
    }

    const onCatch = (error: Error) => this.quote(error.message)

    this.validate().then(onThen).catch(onCatch)

    this.basicAPIManager = new BasicAPIManager({ baseURI: 'https://discord.com/api/v8' })

  }

  async quote(content: string | MessageEmbed, message?: Message) {
    if (!message) message = this.data.message

    const repliedMessage = await this.basicAPIManager.post({
      path: ['channels', this.data.message.channel.id, 'messages'],
      body: {
        embed: typeof content === 'object' ? content : null,
        content: typeof content === 'string' ? content : null,
        message_reference: {
          message_id: message.id,
          messagechannel_id: message.channel.id,
          channelguild_id: message.guild?.id
        }
      },
      authorization: `Bot ${process.env.TOKEN}`
    })

    return this.data.message.channel.messages.fetch(repliedMessage.id)
  }

  async validate() {
    this.validatePermissions()
    await this.validateProperties()
  }

  validatePermissions() {
    const clientPermissionsSerialized = this.config.permissions.client.serialize()
    const memberPermissionsSerialized = this.config.permissions.member.serialize()
    const clientPermissionsStringified = Object.entries(clientPermissionsSerialized)
      .filter(permission => permission[1])
      .map(permission => `\`${permission[0]}\``).join(', ')
    const memberPermissionsStringified = Object.entries(memberPermissionsSerialized)
      .filter(permission => permission[1])
      .map(permission => `\`${permission[0]}\``).join(', ')

    const mePermissions = this.data.message.guild?.me?.hasPermission(this.config.permissions.client)
    if (!mePermissions) throw new Error(`Não tenho as permissões ${clientPermissionsStringified}`)

    const memberPermissions = this.data.message.member?.hasPermission(this.config.permissions.member)
    if (!memberPermissions) throw new Error(`Você não tem as permissões necessárias: ${memberPermissionsStringified}`)

    return true
  }

  async validateProperties() {
    if (!this.props) return true

    let index = 0
    for (const [key, value] of Object.entries(this.props)) {
      try {
        const data: object = { ...value, key, position: index, args: this.data.args, message: this.data.message, client: this.data.client }
        this.props[key] = await validatorByType(value.type)(data)
      } catch (error) {
        const argumentIndex = value.joinSpace ? `${index + 1}...` : index + 1

        const translatedError = translateError(error.message)

        switch (error.message) {
          // When the member doesn't provide an argument
          case 'MISSING_ARGUMENT': throw new Error(translatedError({ missing_on: this.missingOn({ key, text: value.text }) }))
          // When the argument's length is less than the mininum
          case 'LESS_THAN_MIN_LENGTH': throw new Error(translatedError({ argument_index: argumentIndex, min: error.props.min, error_length: this.errorLength({ position: index, len: error.props.min }) }))
          // When the argument's length is bigger than the maximum
          case 'MAX_LENGTH_EXCEEDED': throw new Error(translatedError({ argument_index: argumentIndex, max: error.props.max, error_length: this.errorLength({ position: index, len: error.props.max }) }))
          // When the member doesn't provide a valid argument
          case 'ARGUMENT_NOT_FOUND': throw new Error(translatedError({ argument_index: argumentIndex, not_found: this.notFound({ arg: (error.props || {}).arg, position: index, type: value.type, joinSpace: value.joinSpace }) }))
          // When the member informs a channel that is not compatible with a specific type
          case 'INCOMPATIBLE_CHANNEL_TYPE': throw new Error(translatedError({ argument_index: argumentIndex, expected_type: error.props.expectedType, received_type: error.props.receivedType, channel_name: error.props.channelName }))
          // if the error is not evoked by validatorByType#method
          default: {
            console.log(error)
            throw error
          }
        }
      }
      if (value.joinSpace === true) break;
      index++
    }

  }
}

export { BaseCommand }