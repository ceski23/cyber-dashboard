import { experimental_streamedQuery, skipToken, useQuery } from '@tanstack/react-query'
import { isNil } from 'es-toolkit'

import { streamStatus, type ServiceStatus } from './index'

export const useServiceStatus = (provider?: string, serviceId?: string) =>
	useQuery({
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
