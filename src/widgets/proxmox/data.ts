import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import ky from 'ky'
import { z } from 'zod'

const proxmoxNodeStatusSchema = z.object({
	data: z.object({
		cpu: z.number(),
		memory: z.object({
			total: z.number(),
			used: z.number(),
			free: z.number(),
		}),
		rootfs: z
			.object({
				total: z.number(),
				used: z.number(),
				free: z.number(),
				avail: z.number(),
			})
			.optional(),
		uptime: z.number(),
	}),
})

const proxmoxGuestSchema = z.object({
	vmid: z.number(),
	name: z.string().optional(),
	status: z.string(),
})

const proxmoxGuestListSchema = z.object({
	data: z.array(proxmoxGuestSchema),
})

const fetchProxmoxData = createServerFn({ method: 'GET' })
	.inputValidator(
		z.object({
			baseUrl: z.string(),
			node: z.string(),
			apiToken: z.string(),
		}),
	)
	.handler(async ({ data: { baseUrl, node, apiToken } }) => {
		const { signal } = getRequest()
		const apiClient = ky.create({
			prefixUrl: new URL('api2/json/', baseUrl).toString(),
			signal,
			headers: {
				Authorization: `PVEAPIToken=${apiToken}`,
			},
		})
		const [statusResult, qemuResult, lxcResult] = await Promise.all([
			apiClient
				.get(`nodes/${node}/status`)
				.json()
				.then(raw => proxmoxNodeStatusSchema.parse(raw)),
			apiClient
				.get(`nodes/${node}/qemu`)
				.json()
				.then(raw => proxmoxGuestListSchema.parse(raw)),
			apiClient
				.get(`nodes/${node}/lxc`)
				.json()
				.then(raw => proxmoxGuestListSchema.parse(raw)),
		])
		const vmsRunning = qemuResult.data.filter(guest => guest.status === 'running').length
		const containersRunning = lxcResult.data.filter(guest => guest.status === 'running').length

		return {
			cpu: statusResult.data.cpu,
			memory: statusResult.data.memory,
			storage: statusResult.data.rootfs,
			uptime: statusResult.data.uptime,
			vms: {
				running: vmsRunning,
				total: qemuResult.data.length,
			},
			containers: {
				running: containersRunning,
				total: lxcResult.data.length,
			},
		}
	})

export const proxmoxDataQuery = (baseUrl: string, node: string, apiToken: string, refreshInterval: number) =>
	queryOptions({
		queryKey: ['proxmoxData', { baseUrl, node, refreshInterval }] as const,
		queryFn: ({ signal }) => fetchProxmoxData({ data: { baseUrl, node, apiToken }, signal }),
		refetchInterval: refreshInterval,
	})
