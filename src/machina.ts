import 'module-alias/register';
import { Client, Intents, PartialTypes } from 'discord.js';
import { BOT } from '@root/config';
import consoleStamp from 'console-stamp';

const BOT_INTENTS = [
	Intents.FLAGS.DIRECT_MESSAGES,
	Intents.FLAGS.GUILDS,
	Intents.FLAGS.GUILD_BANS,
	Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	Intents.FLAGS.GUILD_INVITES,
	Intents.FLAGS.GUILD_MEMBERS,
	Intents.FLAGS.GUILD_MESSAGES,
	Intents.FLAGS.GUILD_MESSAGE_REACTIONS
];

const BOT_PARTIALS: PartialTypes[] = [
	'CHANNEL',
	'MESSAGE',
	'GUILD_MEMBER'
];

consoleStamp(console, {
	format: ':date(dd/mm/yy hh:MM:ss.L tt)'
});

async function main() {
	const bot = new Client({
		partials: BOT_PARTIALS,
		intents: BOT_INTENTS,
		allowedMentions: { parse: ['users'] }
	});

	bot.login(BOT.TOKEN);

	bot.once('ready', async () => {
		console.log(`${BOT.NAME} online`);
		console.log(`${bot.ws.ping}ms WS ping`);
		console.log(`Logged into ${bot.guilds.cache.size} guilds`);
		console.log(`Serving ${bot.users.cache.size} users`);
	});
}

main();