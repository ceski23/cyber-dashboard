import type z from 'zod'

import { cpuLoad } from './cpuLoad'
import { memoryUsed } from './memoryUsed'
import { serviceLink } from './serviceLink'

export const widgets = {
	[cpuLoad.type]: cpuLoad,
	[memoryUsed.type]: memoryUsed,
	[serviceLink.type]: serviceLink,
}

export type WidgetType = {
	[K in keyof typeof widgets]: z.infer<(typeof widgets)[K]['schema']>
}[keyof typeof widgets]
