import { ActivityType } from 'discord.js';

export interface MachData {
	status: {
		type: ActivityType;
		name: string;
	};
	commandSettings: Array<{ name: string, enabled: boolean }>;
}