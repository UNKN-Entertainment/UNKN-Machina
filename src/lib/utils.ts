//	https://github.com/ud-cis-discord/SageV2/blob/222918977bb3d73476492bdbf16b8edacbb6d2c8/src/lib/utils.ts

import { ApplicationCommandPermissionData, Client, MessageEmbed } from 'discord.js';
import { Command, CompCommand } from '@root/src/lib/types/Command';
import * as fs from 'fs';

export function getCmd(bot: Client, cmd: string): Command {
	cmd = cmd.toLowerCase();
	return bot.commands.get(cmd);
}

export function updateCmd(oldCmd: CompCommand, newCmd: CompCommand): boolean {
	return oldCmd.name === newCmd.name
		&& oldCmd.description === newCmd.description;
}

/*
export function updateCmdOptionsList(oldCmdList: ApplicationCommandOptionData[], newCmdList: ApplicationCommandOptionData[]): boolean {
	const validCmdList = oldCmdList.every(oldCmdOption => newCmdList.find(newCmdOption =>
		newCmdOption.name === oldCmdOption.name
		&& newCmdOption.description === oldCmdOption.description
		&& newCmdOption.type === oldCmdOption.type
	));
	return validCmdList;
}
*/

export function isPermEqual(oldPerm: ApplicationCommandPermissionData, newPerm: ApplicationCommandPermissionData): boolean {
	return oldPerm.id === newPerm.id
		&& oldPerm.permission === newPerm.permission
		&& oldPerm.type === newPerm.type;
}

export function generateErrorEmbed(msg: string): MessageEmbed {
	const responseEmbed = new MessageEmbed()
		.setColor('#ff0000')
		.setTitle('Error')
		.setDescription(msg);
	return responseEmbed;
}

export function readdirRecursive(dir: string): string[] {
	let results = [];
	const list = fs.readdirSync(dir);
	list.forEach((file) => {
		file = `${dir}/${file}`;
		const stat = fs.statSync(file);
		if (stat && stat.isDirectory()) {
			/* Recurse into a subdirectory */
			results = results.concat(readdirRecursive(file));
		} else {
			/* Is a file */
			results.push(file);
		}
	});
	return results;
}
