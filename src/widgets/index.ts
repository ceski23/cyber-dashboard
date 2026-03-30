import z from 'zod'
import { blockyWidget } from './blocky'
import { cpuLoad } from './cpuLoad'
import { cupWidget } from './cup'
import { gatusWidget } from './gatus'
import { memoryUsed } from './memoryUsed'
import { openMeteoAirQuality } from './openMeteoAirQuality'
import { openMeteoWeather } from './openMeteoWeather'
import { proxmoxWidget } from './proxmox'
import { serviceLink } from './serviceLink'
import { storageUsed } from './storageUsed'
import { traefikWidget } from './traefik'

export const widgets = {
	[cpuLoad.type]: cpuLoad,
	[memoryUsed.type]: memoryUsed,
	[serviceLink.type]: serviceLink,
	[openMeteoWeather.type]: openMeteoWeather,
	[openMeteoAirQuality.type]: openMeteoAirQuality,
	[storageUsed.type]: storageUsed,
	[gatusWidget.type]: gatusWidget,
	[traefikWidget.type]: traefikWidget,
	[cupWidget.type]: cupWidget,
	[proxmoxWidget.type]: proxmoxWidget,
	[blockyWidget.type]: blockyWidget,
}

export type WidgetType = {
	[K in keyof typeof widgets]: z.infer<(typeof widgets)[K]['schema']>
}[keyof typeof widgets]
