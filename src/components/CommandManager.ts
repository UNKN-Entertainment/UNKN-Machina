// source: https://github.com/ud-cis-discord/SageV2/blob/222918977bb3d73476492bdbf16b8edacbb6d2c8/src/pieces/commandManager.ts

import { Collection, Client, CommandInteraction, ApplicationCommand, ApplicationCommandPermissionData } from 'discord.js';
import { updateCmd, isPermEqual, readdirRecursive } from '@lib/utils';
import { Command, CompCommand } from '@root/src/lib/types/Command';
import { GUILD } from '@root/config';
import { CommandError } from '../lib/types/Errors';

async function register(bot: Client): Promise<void> {
	try {
		await loadCmds(bot);
	} catch (error) {
		bot.emit('error', error);
		
	}

	bot.on('interactionCreate', async interaction => {
		if (interaction.isCommand()) runCmd(interaction, bot);
	});
}

async function loadCmds(bot: Client) {
	bot.commands = new Collection();
	await bot.guilds.cache.get(GUILD).commands.fetch();
	const { commands } = bot.guilds.cache.get(GUILD);
	let numNew = 0, numEdited = 0;

	const cmdFiles = readdirRecursive(`${__dirname}/../cmds`).filter(file => file.endsWith('.js'));

	const awaitedCmds: Promise<ApplicationCommand>[] = [];

	console.log('\n\n\t\t-----   ( LOADING COMMANDS )  -----\n');
	
	for (const file of cmdFiles) {
		const cmdModule = await import(file);

		const dirs = file.split('/');
		const name = dirs[dirs.length - 1].split('.')[0];

		if (!(typeof cmdModule.default === 'function')) {
			console.log(`Invalid command ${ name }`);
			continue;
		}

		const command: Command = new cmdModule.default;
		command.name = name;

		if (!command.description || command.description.length >= 100 || command.description.length <= 0) {
			throw `Command ${ command.name }'s description must be between 1 and 100 characters.`;
		}

		command.category = dirs[dirs.length - 2];

		const guildCmd = commands.cache.find(cmd => cmd.name === command.name);

		const cmdData = {
			name: command.name,
			description: command.description,
			options: command?.options || [],
			defaultPermission: false
		};

		if (!guildCmd) {
			awaitedCmds.push(commands.create(cmdData));
			numNew++;
			console.log(`${ command.name } doesn't exist, creating...`);
		} else if (!updateCmd(cmdData, guildCmd as CompCommand)) {
			awaitedCmds.push(commands.edit(guildCmd.id, cmdData));
			numEdited++;
			console.log(`${ command.name } has changed, updating...`);
		}
		bot.commands.set(name, command);
	}

	await Promise.all(awaitedCmds);

	let permsUpdated = 0;
	console.log('Checking for updated permissions...');
	await Promise.all(commands.cache.map(async command => {
		let curPerms: ApplicationCommandPermissionData[];
		try {
			curPerms = await command.permissions.fetch({ command: command.id });
		} catch (err) {
			curPerms = [];
		}

		const botCmd = bot.commands.find(cmd => cmd.name === command.name);
		if (botCmd
			&& (botCmd.permissions.length !== curPerms.length
				|| !botCmd.permissions.every(perm =>
					curPerms.find(curPerm => isPermEqual(curPerm, perm))))) {
			console.log(`Updating permissions for ${ botCmd.name }`);
			permsUpdated++;
			return commands.permissions.set({
				command: command.id,
				permissions: botCmd.permissions
			});
		}
	}));

	console.log(`${ bot.commands.size } commands loaded (${ numNew } created, ${ numEdited } edited), ${ permsUpdated } permission${ permsUpdated === 1 ? '' : 's' } updated.`);
}

async function runCmd(interaction: CommandInteraction, bot: Client): Promise<unknown> {
	const cmd = bot.commands.get(interaction.commandName);
	if (cmd.run !== undefined) {
		try {
			cmd.run(interaction)
				?.catch(async (error: Error) => {
					interaction.reply({ content: 'Sorry, an error has occurred. I have notified a moderator.', ephemeral: true });
					bot.emit('error', new CommandError(error, interaction));
				});
		} catch (error) {
			bot.emit('error', new CommandError(error, interaction));
		}
	} else {
		return interaction.reply('Something seems to be wrong with this command.');
	}
}

export default register;
