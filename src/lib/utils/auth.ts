import { getServiceBearerToken } from '#lib/auth/oauth2'
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

export const withOAuth2BearerToken: BeforeRequestHook = async request => {
	if (request.headers.has('Authorization')) {
		return request
	}

	const token = await getServiceBearerToken()
	if (!token) return request

	request.headers.set('Authorization', `Bearer ${token.accessToken}`)

	return request
}
