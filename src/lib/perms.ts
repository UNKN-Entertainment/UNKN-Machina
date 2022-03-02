import { ApplicationCommandPermissionData } from 'discord.js';
import { ROLES } from '@root/config';

export const STAFF_PERMS: ApplicationCommandPermissionData = {
	id: ROLES.STAFF,
	permission: true,
	type: 'ROLE'
};

export const OPS_PERMS: ApplicationCommandPermissionData = {
	id: ROLES.OPS,
	permission: true,
	type: 'ROLE'
};

export const BOTMASTER_PERMS: ApplicationCommandPermissionData = {
	id: ROLES.BOT_MASTER,
	permission: true,
	type: 'USER'
};
