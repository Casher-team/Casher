import { readdirSync } from 'fs'
import { join } from 'path'
import { NewClient } from '../../structures/NewClient'

function commandHandler(client: NewClient, commandsPath: string) {
  loadFolder(client, commandsPath)
}

function loadFolder(client: NewClient, folder: string) {
  const dirents = readdirSync(folder, { withFileTypes: true })

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      console.log(`> CommandHandler: Loading the folder: ${dirent.name}`)
      loadFolder(client, join(folder, dirent.name))
    }
    else {
      console.log(`> CommandHandler: Loading the file: ${dirent.name}`)
      loadFile(client, folder, dirent.name)
    }
  }
}

async function loadFile(client: NewClient, folder: string, file: string) {
  const command = await import(join(folder, file))

  if (!command.run) return console.log(`Command could not be loaded because there's no method for running.`)

  if (!command.name) command.name = file.split('.')[0]
  if (!command.category) command.category = 'none'

  client.commands.set(command.name, command)
  console.log(`> CommandHandler: Command ${command.name} loaded`)

  if (command.aliases) {
    for (const alias of command.aliases) {
      client.aliases.set(alias, command)
      console.log(`> CommandHandler: Alias ${alias} synced with ${command.name}`)
    }
  }
}

module.exports = commandHandler