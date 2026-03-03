import { configMiddleware } from '#lib/config/middleware'
import { experimental_streamedQuery, queryOptions, skipToken } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { isNil } from 'es-toolkit'
import { z } from 'zod'
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

export const serviceStatusQuery = (provider?: string, serviceId?: string) =>
	queryOptions({
		queryKey: ['servicesStatus', provider],
		queryFn:
			isNil(provider) || isNil(serviceId)
				? skipToken
				: experimental_streamedQuery({
						initialValue: [] as ServiceStatus[],
						reducer: (_prev, next: ServiceStatus[]) => next,
						streamFn: ({ signal }) => streamStatus({ data: { provider }, signal }),
					}),
		select: (services: ServiceStatus[]) => {
			const service = services.find(({ service }) => service === serviceId)

			if (!service) {
				throw new Error(`Service with id "${serviceId}" not found in provider "${provider}"`)
			}

			return service
		},
	})
