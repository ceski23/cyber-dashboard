import { queryOptions } from '@tanstack/react-query'

type Location =
	| 'auto'
	| {
			latitude: number
			longitude: number
	  }

export const locationQuery = (location: Location) =>
	queryOptions({
		queryKey: ['location', location],
		retry: false,
		queryFn: async () => {
			if (location !== 'auto') return location

			return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					position =>
						resolve({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						}),
					reject,
				)
			})
		},
	})
