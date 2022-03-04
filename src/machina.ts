import 'module-alias/register';
import { Client, Intents, PartialTypes } from 'discord.js';
import { version } from '@root/package.json';
import { BOT, PREFIX } from '@root/config';
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
		const guilds = bot.guilds.cache.size;
		const users = bot.users.cache.size;
		
		console.log(`\n
		-----------------------------------
		\t${ BOT.NAME } online\n
		\t${ bot.ws.ping }ms ping\n
		\tLogged into ${ guilds } guild${ guilds === 1 ? '' : 's'}\n
		\tServing ${ users } user${ users === 1 ? '' : 's' }
		-----------------------------------`);
		
		const activity = `${PREFIX}help`;
		const type = 'PLAYING';
		bot.user.setActivity(`${activity} (v${version})`, { type });
		setTimeout(() => bot.user.setActivity(activity, { type }), 30e3);
	});
}

main();
