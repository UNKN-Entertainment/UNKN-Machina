import { ROLES } from '@root/config';
import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from 'discord.js';

export abstract class Command {

	// members
	name: string;
	category: string;
	description: string;
	usage?: string;
	options?: ApplicationCommandOptionData[];
	permissions?: ApplicationCommandPermissionData[] = [{
		id: ROLES.EVERYONE,
		type: 'ROLE',
		permission: true
	}];

	// functions
	abstract run(interaction: CommandInteraction): Promise<unknown>;

}

export interface CompCommand {
	name: string,
	description: string,
	options: ApplicationCommandOptionData[]
}
