import { defaultServiceApiClient } from '#lib/utils/api'
import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { addSeconds } from 'date-fns'
import { isNotNil } from 'es-toolkit'
import { z } from 'zod'
import { parseQueryTotals } from './utils'

const blockingStatusSchema = z.object({
	enabled: z.boolean(),
	autoEnableInSec: z.number().min(0).optional(),
	disabledGroups: z.array(z.string()).optional(),
})

export const fetchBlockyData = createServerFn({ method: 'GET' })
	.inputValidator(z.object({ baseUrl: z.string() }))
	.handler(async ({ data: { baseUrl } }) => {
		const { signal } = getRequest()
		const apiClient = defaultServiceApiClient.extend({
			prefixUrl: baseUrl,
			signal,
		})

		const statusPromise = apiClient
			.get('api/blocking/status')
			.json()
			.then(raw => blockingStatusSchema.parse(raw))

		const metricsPromise = apiClient
			.get('metrics')
			.text()
			.catch(() => null)

		const [status, metricsText] = await Promise.all([statusPromise, metricsPromise])

		return {
			status,
			autoEnableAt: isNotNil(status.autoEnableInSec) ? addSeconds(new Date(), status.autoEnableInSec) : undefined,
			metrics: metricsText != null ? parseQueryTotals(metricsText) : null,
		}
	})

export const toggleBlocking = createServerFn({ method: 'POST' })
	.inputValidator(z.object({ baseUrl: z.string(), enable: z.boolean() }))
	.handler(async ({ data: { baseUrl, enable } }) => {
		const { signal } = getRequest()

		await defaultServiceApiClient.get(`api/blocking/${enable ? 'enable' : 'disable'}`, {
			prefixUrl: baseUrl,
			signal,
		})
	})

export const blockyDataQuery = (baseUrl: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['blockyData', { baseUrl, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchBlockyData({ data: { baseUrl }, signal }),
		refetchInterval: refreshInterval,
	})
