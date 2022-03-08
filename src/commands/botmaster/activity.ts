import { ActivityType, ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from 'discord.js';
import { BOT } from '@root/config';
import { BOTMASTER_PERMS } from '@lib/perms';
import { Command } from '@lib/types/Command';

const ACTIVITIES = ['Playing', 'Streaming', 'Listening', 'Watching', 'Custom', 'Competing'];

export default class extends Command {
	
	permissions: ApplicationCommandPermissionData[] = [BOTMASTER_PERMS];
	description = `Sets ${BOT.NAME}'s activity to the given status and content`;

	options: ApplicationCommandOptionData[] = [
		{
			name: 'status',
			description: 'The activity status.',
			type: 'STRING',
			required: true,
			choices: ACTIVITIES.map((activity) => ({
				name: activity,
				value: activity
			}))
		},
		{
			name: 'content',
			description: 'The activity itself (ex: /help).',
			type: 'STRING',
			required: true
		}
	];

	async run(interaction: CommandInteraction): Promise<void> {
		// const bot = interaction.client;
		const content = interaction.options.getString('content');
		const type = interaction.options.getString('status').toUpperCase() as ActivityType;

		// bot.user.setActivity(content, { type });

		interaction.reply({ content: `Set ${BOT.NAME}'s activity to *${type} ${content}*`, ephemeral: true });
	}

}