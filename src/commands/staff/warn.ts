import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction, Message, MessageEmbed, TextChannel } from 'discord.js';
import { OP_PERMS } from '@lib/perms';
import { Command } from '@lib/types/Command';
import { CHANNELS } from '@root/config';

export default class extends Command {

	permissions: ApplicationCommandPermissionData[] = [OP_PERMS];
	description = 'Warn a user for breaking the server rules and delete the offending message.';
	options: ApplicationCommandOptionData[] = [
		{
			name: 'msglink',
			description: 'Link to the offending message.',
			type: 'STRING',
			required: true
		},
		{
			name: 'reason',
			description: 'Reason for warning the user.',
			type: 'STRING',
			required: false
		}
	];

	async run(interaction: CommandInteraction): Promise<Message> {
		const msg = await interaction.channel.messages.fetch(this.checkMsgLink(interaction.options.getString('msglink')));
		const reason = interaction.options.getString('reason') || 'Breaking server rules.';

		const embed = new MessageEmbed()
			.setTitle(`${interaction.user.tag} warned ${msg.author.tag}`)
			.setFooter(`${msg.author.tag}'s ID: ${msg.author.id} | ${interaction.user.tag}'s ID: ${interaction.user.id}`)
			.addFields([{
				name: 'Reason:',
				value: reason
			}, {
				name: 'Message:',
				value: msg.content || '*This message had no text content*'
			}]);
		(interaction.guild.channels.cache.get(CHANNELS.MOD_LOG) as TextChannel).send({ embeds: [embed] });

		let disabled = false;
		let modReply = '';
		msg.author.send(`Your message was deleted in ${msg.channel} by a moderator. Below is the given reason:\n${reason}`)
			.catch(async () => {
				disabled = true;
				modReply = `${ msg.author.tag } has DMs disabled, so I could not warn them.\n`;
			});

		interaction.reply({ content: `${ disabled ? `${ modReply } However, the offending message has still been deleted and logged.` 
			: `${msg.author.username} has been warned, and the offending message has been deleted and logged.` }`, ephemeral: true });
		return msg.delete();
	}
	
	checkMsgLink(msgLink: string): string {
		let msgId: string;
		if ((msgId = msgLink.split('/').pop()) === undefined) throw 'You must call this function with a message link!';
		return msgId;
	}
}