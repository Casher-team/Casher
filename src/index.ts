import { Client } from 'discord.js'
import { config } from 'dotenv'

config()

const client = new Client();



client.login(process.env.TOKEN)