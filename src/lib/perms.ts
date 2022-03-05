import { ApplicationCommandPermissionData } from 'discord.js';
import { ROLES } from '@root/config';

export const MINI_OP_PERMS: ApplicationCommandPermissionData = {
	id: ROLES.MINI_OP,
	permission: true,
	type: 'ROLE'
};

export const OP_PERMS: ApplicationCommandPermissionData = {
	id: ROLES.OP,
	permission: true,
	type: 'ROLE'
};

export const BOTMASTER_PERMS: ApplicationCommandPermissionData = {
	id: ROLES.BOT_MASTER,
	permission: true,
	type: 'USER'
};
