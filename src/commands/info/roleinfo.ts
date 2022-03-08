import { MessageEmbed, Role, MessageAttachment, ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from 'discord.js';
import { OP_PERMS } from '@lib/perms';
import { Command } from '@lib/types/Command';
import moment from 'moment';

export default class extends Command {

	description = 'Gives information about a role, including a list of the members who have it.';
	runInDM = false;
	options: ApplicationCommandOptionData[] = [
		{
			name: 'role',
			description: 'Role to get the info of',
			type: 'ROLE',
			required: true
		}
	];
	permissions: ApplicationCommandPermissionData[] = [OP_PERMS];

	async run(interaction: CommandInteraction): Promise<void> {
		const role = interaction.options.getRole('role') as Role;

		const memberList = role.members || (await interaction.guild.roles.fetch(role.id)).members;

		const memberStrs = memberList.map(m => m.user.username).sort();

		const members = memberStrs.join(', ').length > 1000
			? await this.sendToFile(memberStrs.join('\n'), 'txt', 'MemberList', true) : memberStrs.join(', ');

		const embed = new MessageEmbed()
			.setColor(role.color)
			.setTitle(`${role.name} | ${memberList.size} members`)
			.setFooter(`Role ID: ${role.id}`);

		const attachments: MessageAttachment[] = [];

		if (members instanceof MessageAttachment) {
			embed.addField('Members', 'Too many to display, see attached file.', true);
			attachments.push(members);
		} else {
			embed.addField('Members', memberList.size < 1 ? 'None' : members, true);
		}
		return interaction.reply({ embeds: [embed], files: attachments });
	}

	async sendToFile(input: string, filetype = 'txt', filename: string = null, timestamp = false): Promise<MessageAttachment> {
		const time = moment().format('M-D-YY_HH-mm');
		filename = `${filename}${timestamp ? `_${time}` : ''}` || time;
		return new MessageAttachment(Buffer.from(input.trim()), `${filename}.${filetype}`);
	}
}