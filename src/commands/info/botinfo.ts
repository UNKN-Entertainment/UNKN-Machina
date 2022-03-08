import { CommandInteraction } from 'discord.js';
import { BOT, BOT_MODS } from '@root/config';
import { Command } from '@lib/types/Command';
import { BOTMASTER_PERMS } from '@root/src/lib/perms';

export default class extends Command {

	description = `Provides information about ${BOT.NAME}.`;

	async run(interaction: CommandInteraction): Promise<void> {
		const botInfo
		= `UNKN Machina is a custom Discord mod-bot created to manage the UNKN Entertainment Discord server. 
		Machina includes multiple systems to facilitate server moderation and encourage engagement from users.  

		Current features of Machina include:
		[...]
		
		Created & maintained by: \n
		${ interaction.client.users.fetch(BOTMASTER_PERMS.id) }
		
		Currently moderated by: \n
		${ BOT_MODS }
			
		If you're interested in how ${BOT.NAME} works, you can see the code here:\n 
		<https://github.com/UNKN-Entertainment/UNKN-Machina>.`;

		return interaction.reply(botInfo);
	}

}