import { TextChannel, ApplicationCommandPermissionData, CommandInteraction, ApplicationCommandOptionData } from 'discord.js';
import { OP_PERMS } from '@lib/perms';
import { CHANNELS } from '@root/config';
import { Command } from '@root/src/lib/types/Command';

export default class extends Command {
	
	permissions: ApplicationCommandPermissionData[] = [OP_PERMS];
	description = 'Send an announcement from Machina to a specified channel (the default is the announcements channel).';

	options: ApplicationCommandOptionData[] = [{
		name: 'channel',
		description: 'The channel to send the announcement in. Leave this blank to default to the announcements channel',
		type: 'CHANNEL',
		required: false
	},
	{
		name: 'content',
		description: 'The announcement content. Typing \n will insert a line break.',
		type: 'STRING',
		required: true
	},
	{
		name: 'image',
		description: 'The url of the image to add to the announcement.',
		type: 'STRING',
		required: false
	}];

	async run(interaction: CommandInteraction): Promise<void> {
		const announceChannel = interaction.guild.channels.cache.get(CHANNELS.ANNOUNCEMENTS);
		const channelOption = interaction.options.getChannel('channel');
		
		const image = interaction.options.getString('image');
		let content = interaction.options.getString('content');

		const tmpMsg = content.split('\\n');
		content = tmpMsg.join('\n');

		const channel = (channelOption || announceChannel) as TextChannel;
		await channel.send({
			content: content,
			allowedMentions: { parse: ['everyone', 'roles'] }
		});
		if (image) {
			await channel.send({
				content: image
			});
		}
		return interaction.reply(`I've sent your announcement to ${channel}.`);
	}

}