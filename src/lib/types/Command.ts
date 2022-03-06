import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction } from 'discord.js';

export abstract class Command {
	name: string;
	category: string;
	description: string;
	usage?: string;
	extendedHelp?: string;
	options?: ApplicationCommandOptionData[];
	permissions?: ApplicationCommandPermissionData[] = [];

	abstract run(interaction: CommandInteraction): Promise<unknown>;
}

export interface CompCommand {
	name: string,
	description: string,
	options?: ApplicationCommandOptionData[]
}
