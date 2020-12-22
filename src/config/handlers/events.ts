import { readdirSync } from 'fs'
import { join } from 'path'

import { NewClient } from "../../structures/Client"
import { BaseEvent } from '../../structures/BaseEvent'

function eventsHandler(client: NewClient, eventsPath: string) {
  loadFolder(client, eventsPath)
  listenEvents(client)
}

function loadFolder(client: NewClient, folder: string) {
  const dirents = readdirSync(folder, { withFileTypes: true })

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      console.log(`> EventsHandler: Loading the folder: ${dirent.name}`)
      loadFolder(client, join(folder, dirent.name))
    }
    else {
      console.log(`> EventsHandler: Loading the file: ${dirent.name}`)
      loadFile(client, folder, dirent.name)
    }
  }
}

async function loadFile(client: NewClient, folder: string, file: string) {
  const fileName = file.split('.')[0]
  const eventName = folder.split('/')[folder.split('/').length - 1]
  let event: BaseEvent = await import(join(folder, file))

  if (fileName !== 'index') return
  if (!event || !event.run) event = new BaseEvent({ listeners: event.listeners })
  if (!event.listeners) event.listeners = [eventName]

  /* if (!event.run) return console.log(`Event could not be loaded because there's no method for running.`) */
  /* if (typeof event.listeners === 'string') event.listeners = [event.listeners] */
  // ^^^ Os trechos acima estão comentados, pois não se faz mais necessário a verificação AQUI, logo que essas mesmas verificações são feitas no constructor da classe BaseEvent

  for (const listener of event.listeners) {
    const listeningTo = client.events.get(listener) || []

    client.events.set(listener, [...listeningTo, event])
  }
}

function listenEvents(client: NewClient) {
  const listeners = [...client.events.keys()]

  for (const listener of listeners) {
    client.on(listener, (...params) => client.events.get(listener)!.map(event => event.run(client, ...params)))
  }
}

export { eventsHandler }