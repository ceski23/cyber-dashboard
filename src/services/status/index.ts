import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { z } from 'zod'

import { configMiddleware } from '@/lib/config/middleware'

import { streamDockerStatus } from './docker'
import { streamGatusStatus } from './gatus'
import { streamPingStatus } from './ping'

export type ServiceStatus = {
	service: string
	status: 'available' | 'unavailable' | 'pending' | 'unknown'
	label: string
}

export const streamStatus = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.inputValidator(
		z.object({
			provider: z.string(),
		}),
	)
	.handler(async function* ({ data: { provider }, context: { config } }) {
		const providerOptions = config.statusProviders?.[provider]
		const { signal } = getRequest()

		if (!providerOptions) {
			throw new Error(`No status provider configuration found with name: ${provider}`)
		}

		switch (providerOptions.type) {
			case 'docker':
				yield* await streamDockerStatus({ signal, data: providerOptions })
				break
			case 'gatus':
				yield* await streamGatusStatus({ signal, data: providerOptions })
				break
			case 'ping':
				yield* await streamPingStatus({ signal, data: providerOptions })
				break
			default:
				providerOptions satisfies never
				throw new Error(`Unsupported status provider type`)
		}
	})
