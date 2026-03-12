import z from 'zod'
import { cpuLoad } from './cpuLoad'
import { gatusWidget } from './gatus'
import { memoryUsed } from './memoryUsed'
import { openMeteoAirQuality } from './openMeteoAirQuality'
import { openMeteoWeather } from './openMeteoWeather'
import { serviceLink } from './serviceLink'
import { storageUsed } from './storageUsed'

export const widgets = {
	[cpuLoad.type]: cpuLoad,
	[memoryUsed.type]: memoryUsed,
	[serviceLink.type]: serviceLink,
	[openMeteoWeather.type]: openMeteoWeather,
	[openMeteoAirQuality.type]: openMeteoAirQuality,
	[storageUsed.type]: storageUsed,
	[gatusWidget.type]: gatusWidget,
}

export type WidgetType = {
	[K in keyof typeof widgets]: z.infer<(typeof widgets)[K]['schema']>
}[keyof typeof widgets]
