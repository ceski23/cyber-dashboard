import { z } from 'zod'

import { defineWidgetOptions } from '../helpers'

export const openMeteoAirQualityOptions = defineWidgetOptions(
	'open-meteo-air-quality',
	z.strictObject({
		location: z.union([
			z.literal('auto').describe('Automatically determine location.'),
			z.object({
				latitude: z.number().min(-90).max(90).describe('The latitude of the location.'),
				longitude: z.number().min(-180).max(180).describe('The longitude of the location.'),
			}),
		]),
	}),
)
