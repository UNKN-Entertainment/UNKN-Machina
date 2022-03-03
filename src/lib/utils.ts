//	https://github.com/ud-cis-discord/SageV2/blob/222918977bb3d73476492bdbf16b8edacbb6d2c8/src/lib/utils.ts

import { ApplicationCommandOptionData, ApplicationCommandPermissionData, MessageEmbed } from 'discord.js';
import { CompCommand } from '@lib/types/Cmd';
import * as fs from 'fs';

export function isCmdEqual(cmd1: CompCommand, cmd2: CompCommand): boolean {
	return cmd1.name === cmd2.name
		&& cmd1.description === cmd2.description
		&& isOptionsListEqual(cmd1.options, cmd2.options);
}

export function isOptionsListEqual(list1: ApplicationCommandOptionData[], list2: ApplicationCommandOptionData[]): boolean {
	const valid = list1.every(list1Option => list2.find(list2Option =>
		list2Option.name === list1Option.name
			&& list2Option.description === list1Option.description
			&& list2Option.required === list1Option.required
			&& list2Option.type === list1Option.type
	));
	return valid;
}

export function isPermissionEqual(perm1: ApplicationCommandPermissionData, perm2: ApplicationCommandPermissionData): boolean {
	return perm1.id === perm2.id
		&& perm1.permission === perm2.permission
		&& perm1.type === perm2.type;
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
