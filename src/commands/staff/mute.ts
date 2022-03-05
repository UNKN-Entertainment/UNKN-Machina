import { ROLES } from '@root/config';
import { OP_PERMS } from '@lib/perms';
import { Command } from '@lib/types/Command';
import { ApplicationCommandPermissionData, CommandInteraction, ApplicationCommandOptionData } from 'discord.js';

export default class extends Command {

	permissions: ApplicationCommandPermissionData[] = [OP_PERMS];
	description = 'Gives the muted role to the given user, and takes it away if the user is already muted.';
	
	options: ApplicationCommandOptionData[] = [
		{
			name: 'user',
			description: 'The user to mute or un-mute, depending.',
			type: 'USER',
			required: true
		}
	];

	async run(interaction: CommandInteraction): Promise<void> {
		const user = interaction.options.getUser('user');
		const member = await interaction.guild.members.fetch(user.id);

		if (!member) {
			interaction.reply({
				content: `I was not able to find the specified user. As a quick fix, you can give the user the <@&${ROLES.MUTED}> role manually.`,
				ephemeral: true
			});
			throw new Error('Could not find member based on passed in user.');
		}

		if (member.roles.cache.has(ROLES.MUTED)) {
			const reason = `${member.user.username} was un-muted by ${interaction.user.tag} (${interaction.user.id})`;
			await member.roles.remove(ROLES.MUTED, reason);
			return interaction.reply({ content: `${member.user.username} has been un-muted.`, ephemeral: true });
		}

		const reason = `${member.user.username} was muted by ${interaction.user.tag} (${interaction.user.id})`;
		await member.roles.add(ROLES.MUTED, reason);
		let modReply = `${member.user.username} has been muted.`;

		await member.send('You have been muted by a moderator.').catch(() => {
			modReply += '\n\nHowever, they have DMs disabled, so I could not notify them.';
			return;
		});

		return interaction.reply({ content: modReply, ephemeral: true });
	}
}
