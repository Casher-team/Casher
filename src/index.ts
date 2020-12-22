import { config } from 'dotenv'
import { NewClient } from './structures/Client';

config()

const client = new NewClient();

client.login(process.env.TOKEN)