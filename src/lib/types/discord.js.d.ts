import { Command } from '@lib/types/Cmd';
import { Collection } from 'discord.js';

declare module 'discord.js' {
	interface Client{
		commands: Collection<string, Command>;
	}
}