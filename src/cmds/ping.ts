import { CommandInteraction } from 'discord.js';
import { Command } from '@root/src/lib/types/Command';
import prettyMilliseconds from 'pretty-ms';

export default class extends Command {

	description = 'Runs a connection test to Discord';

	async run(interaction: CommandInteraction): Promise<void> {
		const msgTime = new Date().getTime();
		await interaction.reply('Ping?');
		interaction.editReply(`Pong! [ ${ prettyMilliseconds(msgTime - interaction.createdTimestamp) } ]`);
		return;
	}
}
