import { experimental_streamedQuery, useQuery, skipToken } from '@tanstack/react-query'
import { isNil } from 'es-toolkit'
import { z } from 'zod'

import { Route } from '@/routes/_layout/index'

import { dockerOptions, streamDockerStatus } from './docker'
import { gatusOptions, streamGatusStatus } from './gatus'
import { pingOptions, streamPingStatus } from './ping'

export type ServiceStatus = {
	service: string
	status: 'available' | 'unavailable' | 'pending' | 'unknown'
	label: string
}

export const statusProviderSchema = z.union([dockerOptions, gatusOptions, pingOptions])

export const useServiceStatus = (provider?: string, serviceId?: string) => {
	const { config } = Route.useRouteContext()
	const statusProviderConfig = isNil(provider) || isNil(serviceId) ? undefined : config.statusProviders?.[provider]

	if (!statusProviderConfig && !isNil(provider) && !isNil(serviceId)) {
		throw new Error(`No status provider configuration found with name: ${provider}`)
	}

	return useQuery({
		queryKey: ['servicesStatus', provider],
		queryFn: !statusProviderConfig
			? skipToken
			: experimental_streamedQuery({
					initialValue: [] as ServiceStatus[],
					reducer: (_prev, next: ServiceStatus[]) => next,
					streamFn: ({ signal }) => {
						switch (statusProviderConfig.type) {
							case 'docker':
								return streamDockerStatus({ signal, data: statusProviderConfig })
							case 'gatus':
								return streamGatusStatus({ signal, data: statusProviderConfig })
							case 'ping':
								return streamPingStatus({ signal, data: statusProviderConfig })
							default:
								statusProviderConfig satisfies never
								throw new Error(`Unsupported status provider type`)
						}
					},
				}),
		select: (services: ServiceStatus[]) => services.find(({ service }) => service === serviceId),
	})
}
