import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { parseCookie } from 'cookie'
import cookie from 'cookiejs'
import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light' | 'auto'

export const COOKIE_KEY = 'cyber-dashboard-theme'

const subscribe = (callback: () => void) => {
	cookieStore.addEventListener('change', callback)
	return () => cookieStore.removeEventListener('change', callback)
}

const getSnapshot = (): Theme => {
	const stored = cookie.get(COOKIE_KEY)
	return stored === 'light' || stored === 'dark' ? stored : 'auto'
}

const getServerSnapshot = createIsomorphicFn()
	.client(() => getSnapshot())
	.server(() => {
		const cookie = getRequestHeader('cookie')
		const cookieValue = parseCookie(cookie ?? '')[COOKIE_KEY]
		const initialTheme = cookieValue === 'light' || cookieValue === 'dark' ? cookieValue : 'auto'

		return initialTheme
	})

export const useTheme = () => {
	const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
	const setTheme = (next: Theme) => {
		if (next === 'auto') {
			cookie.remove(COOKIE_KEY)
		} else {
			cookie.set(COOKIE_KEY, next)
		}
	}

	return {
		theme,
		setTheme,
	}
}
