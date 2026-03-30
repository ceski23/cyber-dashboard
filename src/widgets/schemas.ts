import { z } from 'zod'
import { blockyOptions } from './blocky/schema'
import { cpuLoadOptions } from './cpuLoad/schema'
import { cupOptions } from './cup/schema'
import { gatusOptions } from './gatus/schema'
import { memoryUsedOptions } from './memoryUsed/schema'
import { openMeteoAirQualityOptions } from './openMeteoAirQuality/schema'
import { openMeteoWeatherOptions } from './openMeteoWeather/schema'
import { proxmoxOptions } from './proxmox/schema'
import { serviceLinkOptions } from './serviceLink/schema'
import { storageUsedOptions } from './storageUsed/schema'
import { traefikOptions } from './traefik/schema'

export const widgetsSchema = z.union([
	cpuLoadOptions,
	memoryUsedOptions,
	serviceLinkOptions,
	openMeteoWeatherOptions,
	openMeteoAirQualityOptions,
	storageUsedOptions,
	gatusOptions,
	traefikOptions,
	cupOptions,
	proxmoxOptions,
	blockyOptions,
])
