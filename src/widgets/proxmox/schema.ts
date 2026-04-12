import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const proxmoxOptions = defineWidgetOptions(
	'proxmox',
	z.strictObject({
		name: z.string().optional().describe('Display name for the widget.'),
		url: z.url().describe('Base URL of the Proxmox VE instance (e.g. https://proxmox.local:8006).'),
		node: z.string().default('pve').describe('Name of the Proxmox node to monitor.'),
		apiToken: z
			.string()
			.describe('Proxmox API token in the format USER@REALM!TOKENID=SECRET (e.g. root@pam!mytoken=abc123...).'),
		refreshInterval: z
			.number()
			.min(ms('1s'))
			.default(ms('30s'))
			.describe('Interval in milliseconds to refresh Proxmox data.'),
	}),
)
