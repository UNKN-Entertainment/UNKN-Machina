import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction, TextChannel } from 'discord.js';
import { BOT } from '@root/config';
import { OP_PERMS } from '@lib/perms';
import { Command } from '@lib/types/Command';

export default class extends Command {

	description = `Edits a message sent by ${ BOT.NAME }.`;
	usage = '<messageLink>|<content>';
	permissions: ApplicationCommandPermissionData[] = [OP_PERMS];

	options: ApplicationCommandOptionData[] = [{
		name: 'msg_link',
		description: `A message link (must be a message sent by ${ BOT.NAME }).`,
		type: 'STRING',
		required: true
	},
	{
		name: 'msg_content',
		description: 'The updated message content. Adding in \n will add in a line break.',
		type: 'STRING',
		required: true
	}];

	async run(interaction: CommandInteraction): Promise<void> {
		const link = interaction.options.getString('msg_link');
		let content = interaction.options.getString('msg_content');

		//	for discord canary users, links are different
		const newLink = link.replace('canary.', '');
		const match = newLink.match(/https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/);
		if (!match) return interaction.reply('Please provide a valid message link.');

		//	find the message
		const [,, channelID, messageID] = match;
		const message = await interaction.client.channels.fetch(channelID)
			.then((channel: TextChannel) => channel.messages.fetch(messageID))
			.catch(() => { throw 'I can\'t seem to find that message'; });

		// check if the message can be edited
		if (!message.editable) {
			return interaction.reply(
				{ content: `It seems that message cannot be edited. You'll need to tag a message that was sent by ${BOT.NAME}`,
					ephemeral: true });
		}

		const tempMessage = content.split('\\n');
		content = tempMessage.join('\n');

		await message.edit(content);
		return interaction.reply('The given message has been updated.');
	}

}