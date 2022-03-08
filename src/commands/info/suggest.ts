import { MessageEmbed, TextChannel, CommandInteraction, ApplicationCommandOptionData } from 'discord.js';
import { BOT, CHANNELS } from '@root/config';
import { Command } from '@lib/types/Command';

export default class extends Command {

	description = `Provide feedback or bug reports about ${BOT.NAME} or the server.`;

	options: ApplicationCommandOptionData[] = [
		{
			name: 'suggestion',
			description: 'The suggestion to send to the moderators.',
			type: 'STRING',
			required: true
		}
	];

	async run(interaction:CommandInteraction): Promise<void> {
		const suggestion = interaction.options.getString('suggestion');
		const feedbackChannel = await interaction.guild.channels.fetch(CHANNELS.FEEDBACK) as TextChannel;

		const embed = new MessageEmbed()
			.setAuthor(interaction.user.tag, interaction.user.avatarURL({ dynamic: true }))
			.setTitle('User Suggestion')
			.setDescription(suggestion)
			.setColor('DARK_GREEN')
			.setTimestamp();

		feedbackChannel.send({ embeds: [embed] });

		return interaction.reply({ content: 'Thanks! I\'ve sent your feedback to a moderator.', ephemeral: true });
	}

}