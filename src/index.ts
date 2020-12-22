import { config } from 'dotenv'
import { NewClient } from './structures/NewClient';

config()

const client = new NewClient();

client.login(process.env.TOKEN)