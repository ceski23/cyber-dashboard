import { z } from 'zod'

import { defineWidgetOptions } from '../helpers'

export const storageUsedOptions = defineWidgetOptions(
	'storage-used',
	z.strictObject({
		drive: z.string().default('/').describe('Drive to monitor (e.g., /dev/sda1)'),
	}),
)
