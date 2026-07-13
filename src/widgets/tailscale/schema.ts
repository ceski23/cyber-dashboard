import { ms } from 'ms'
import { z } from 'zod'
import { defineWidgetOptions } from '../helpers'

export const tailscaleOptions = defineWidgetOptions(
	'tailscale',
	z.strictObject({
		name: z.string().default('Tailscale').describe('Display name for the widget.'),
		clientId: z.string().describe('Tailscale OAuth client ID.'),
		clientSecret: z.string().describe('Tailscale OAuth client secret.'),
		tailnet: z.string().describe('Tailscale tailnet name (e.g. example.ts.net).'),
		refreshInterval: z
			.number()
			.min(ms('5s'))
			.default(ms('30s'))
			.describe('Interval in milliseconds to refresh Tailscale device data.'),
	}),
)
