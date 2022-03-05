import { ApplicationCommandOptionData, CommandInteraction, EmbedField, MessageEmbed, Util, GuildMember } from 'discord.js';
import { getCmd } from '@lib/utils';
import { BOT, PREFIX } from '@root/config';
import { Command } from '@root/src/lib/types/Command';

export default class extends Command {

	description = `Provides info about all ${BOT.NAME} commands`;
	extendedHelp = 'If given no arguments, a list of all commands you have access to will be sent to your DMs';

	options: ApplicationCommandOptionData[] = [
		{
			name: 'cmd',
			description: 'The command that you would like help with.',
			type: 'STRING',
			required: false
		}
	];

	async run(interaction: CommandInteraction): Promise<void> {
		const cmd = interaction.options.getString('cmd');
		const { commands } = interaction.client;

		if (cmd) {
			const command = getCmd(interaction.client, cmd);
			if (!command) {
				return interaction.reply({ content: `**${cmd}** is not a valid command.`, ephemeral: true });
			}

			const embedFields: Array<EmbedField> = [];
			if (command.extendedHelp) {
				embedFields.push({
					name: 'Extended Help',
					value: command.extendedHelp,
					inline: false
				});
			}
			if (command.options) {
				embedFields.push({
					name: `Option${ command.options.length === 1 ? '' : 's' }`,
					value: command.options.map(option =>
						`**${option.name}** ${option.description}`).join('\n'),
					inline: false
				});
			}
			const helpEmbed = new MessageEmbed()
				.setTitle(command.name)
				.setDescription(command.description)
				.addFields(embedFields)
				.setThumbnail(interaction.client.user.avatarURL())
				.setTimestamp(Date.now())
				.setColor('RANDOM');

			return interaction.reply({ embeds: [helpEmbed] });

		} else {
			let helpStr = 'Use `/help <command>` to get more information about the given command.';
			
			const permLvls: Array<string> = [];
			commands.forEach(command => {
				if (!permLvls.includes(command.category)) permLvls.push(command.category);
			});
			//	permission categories
			const member = interaction.member as GuildMember;
			const OPPS = interaction.guild.roles.cache.find(r => r.name === 'OPPS');
			permLvls.forEach(permLvl => {
				let useableCmds = commands.filter(command =>
					command.category === permLvl);
				// check if user isn't OPP and filter accordingly
				if (!member.roles.cache.has(OPPS.id)) {
					useableCmds = useableCmds.filter(command => command.category !== 'OPPS');
				}
				const categoryName = permLvl === 'commands' ? 'General' : `${permLvl[0].toUpperCase()}${permLvl.slice(1)}`;
				if (useableCmds.size > 0) {
					helpStr += `\n**${categoryName} Commands**\n`;
					useableCmds.forEach(command => {
						helpStr += `\`${PREFIX}${command.name}\` ⇒ ${command.description}\n`;
					});
				}
			});

			const splitStr = Util.splitMessage(helpStr, { char: '\n' });
			let notified = false;
			splitStr.forEach((helpMsg) => {
				const embed = new MessageEmbed()
					.setTitle('-- Commands --')
					.setDescription(helpMsg)
					.setColor('RANDOM');
				interaction.user.send({ embeds: [embed] })
					.then(() => {
						if (!notified) {
							if (interaction.channel.type !== 'DM') interaction.reply({ content: 'I\'ve sent all commands to your DMs.', ephemeral: true });
							notified = true;
						}
					})
					.catch(() => {
						if (!notified) {
							interaction.reply({ content: 'I couldn\'t send you a DM. Please enable DMs and try again.', ephemeral: true });
							notified = true;
						}
					});
			});
		}
	}
}
