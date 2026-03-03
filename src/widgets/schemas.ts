import { z } from 'zod'
import { cpuLoadOptions } from './cpuLoad/schema'
import { memoryUsedOptions } from './memoryUsed/schema'
import { openMeteoAirQualityOptions } from './openMeteoAirQuality/schema'
import { openMeteoWeatherOptions } from './openMeteoWeather/schema'
import { serviceLinkOptions } from './serviceLink/schema'
import { storageUsedOptions } from './storageUsed/schema'

export const widgetsSchema = z.union([
	cpuLoadOptions,
	memoryUsedOptions,
	serviceLinkOptions,
	openMeteoWeatherOptions,
	openMeteoAirQualityOptions,
	storageUsedOptions,
])
