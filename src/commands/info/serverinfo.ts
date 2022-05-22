// source: https://github.com/ud-cis-discord/SageV2/blob/main/src/commands/info/serverinfo.ts

import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from '@lib/types/Command';

export default class extends Command {

	description = 'Provides information about the UUNKN Entertainment server.';

	async run(interaction: CommandInteraction): Promise<void> {
		const membersWithRoles = interaction.guild.members.cache.filter(member => member.roles.cache.size > 1).size;
		const percentage = Math.floor((interaction.guild.members.cache.filter(member => member.roles.cache.size > 1).size / interaction.guild.memberCount) * 100);

		const embed = new MessageEmbed()
			.addFields([
				{ name: 'Total Members', value: interaction.guild.memberCount.toString(), inline: true },
				{ name: 'Human Members', value: interaction.guild.members.cache.filter(member => !member.user.bot).size.toString(), inline: true },
				{ name: 'Bot Members', value: interaction.guild.members.cache.filter(member => member.user.bot).size.toString(), inline: true },
				{ name: 'Roles', value: interaction.guild.roles.cache.size.toString(), inline: true },
				{ name: 'Members with Roles', value: `${membersWithRoles} (${percentage}%)`, inline: true },
				{ name: 'Text Channels', value: interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size.toString(), inline: true },
				{ name: 'Voice Channels', value: interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size.toString(), inline: true }
			])
			.setAuthor(interaction.guild.name, interaction.guild.iconURL())
			.setColor('DARK_VIVID_PINK')
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	}

}