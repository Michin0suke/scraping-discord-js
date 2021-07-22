import { TextChannel, DMChannel, NewsChannel } from 'discord.js'

export const sendObj = (channel: TextChannel | DMChannel | NewsChannel, obj: any) => {
  channel.send(JSON.stringify(obj, null, 4))
}
