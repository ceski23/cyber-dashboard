import ky from 'ky'
import { withOAuth2BearerToken } from './auth'

export const defaultServiceApiClient = ky.create({
	hooks: {
		beforeRequest: [withOAuth2BearerToken],
	},
})
