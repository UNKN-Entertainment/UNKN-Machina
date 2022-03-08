import { CommandInteraction, MessageEmbed } from 'discord.js';
import { execSync } from 'child_process';
import { BOT, BOT_MODS } from '@root/config';
import { homepage as repo } from '@root/package.json';
import { Command } from '@lib/types/Command';
import { BOTMASTER_PERMS } from '@root/src/lib/perms';

export default class extends Command {

	description = `Provides information about ${BOT.NAME}.`;

	async run(interaction: CommandInteraction): Promise<void> {
		const [hash, author, message, timestamp, branch] = this.getGitInfo();
		const lastUpdated = new Date(timestamp);

		const embed = new MessageEmbed()
			.setAuthor(BOT.NAME, interaction.guild.iconURL())
			.setDescription(`UNKN Machina is a custom Discord mod-bot created to manage the UNKN Entertainment Discord server.\n
			Machina includes multiple systems to facilitate server moderation and encourage engagement from users.\n 
	
			Current features of Machina include:
			[...]\n
			
			Created & maintained by:\n
			${ interaction.client.users.fetch(BOTMASTER_PERMS.id) }\n
			
			Currently moderated by:\n
			${ BOT_MODS }\n
				
			If you're interested in how ${BOT.NAME} works, you can see the code here:\n 
			<https://github.com/UNKN-Entertainment/UNKN-Machina>.\n`) 
			.addFields([
				{ name: 'Available commands: ', value: interaction.guild.commands.cache.size.toString(), inline: true }, 
				{ name: 'Latest Commit: ', value:  `[${ hash.slice(0, 8) }](${ repo }/commit/${ hash }) on ${ branch } by ${ author }`, inline: true },
				{ name: 'Commit Message: ', value:  `${ message }`, inline: true },
				{ name: 'Last updated: ', value:  `${ lastUpdated }`, inline: true }
			])
			.setColor('BLURPLE')
			.setTimestamp();
		
		return interaction.reply(({ embeds: [embed] }));
	}

	getGitInfo(commitNumber = 0): Array<string> {
		const info = execSync(`cd ${__dirname} && git log --max-count=1 --skip=${commitNumber} --no-merges --format="%H%n%an%n%s%n%ci"` +
			' && git branch --show-current').toString().split('\n');

		if (info[2].toLowerCase().startsWith('version bump')) {
			return this.getGitInfo(commitNumber + 1);
		}
		return info;
	}
}
