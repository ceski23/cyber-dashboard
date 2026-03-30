import type { BeforeRequestHook } from 'ky'

type BasicAuthHookParams = {
	username: string
	password: string
}

export const withBasicAuth =
	({ username, password }: BasicAuthHookParams): BeforeRequestHook =>
	request => {
		const auth = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
		request.headers.set('Authorization', auth)
		return request
	}
