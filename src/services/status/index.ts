import { experimental_streamedQuery, useQuery } from '@tanstack/react-query'
import { z } from 'zod'

import { Route } from '@/routes/_layout/index'

import { dockerOptions, streamDockerStatus } from './docker'
import { gatusOptions, streamGatusStatus } from './gatus'

export type ServiceStatus = {
	service: string
	status: 'available' | 'unavailable' | 'pending' | 'unknown'
	label: string
}

export const statusProviderSchema = z.union([dockerOptions, gatusOptions])

export const useServiceStatus = (connectionName: string, serviceName: string) => {
	const { config } = Route.useRouteContext()
	const statusProviderConfig = config.statusProviders?.[connectionName]

	if (!statusProviderConfig) {
		throw new Error(`No status provider configuration found for connection name: ${connectionName}`)
	}

	return useQuery({
		queryKey: ['servicesStatus', connectionName],
		queryFn: experimental_streamedQuery({
			initialValue: [] as ServiceStatus[],
			reducer: (_prev, next) => next as ServiceStatus[],
			streamFn: ({ signal }) => {
				switch (statusProviderConfig.type) {
					case 'docker':
						return streamDockerStatus({ signal, data: statusProviderConfig })
					case 'gatus':
						return streamGatusStatus({ signal, data: statusProviderConfig })
					default:
						statusProviderConfig satisfies never
						throw new Error(`Unsupported status provider type`)
				}
			},
		}),
		select: services => services.find(({ service }) => service === serviceName),
	})
}
