import { createAuthClient as betterAuthCreateAuthClient } from 'better-auth/react'
import { createContext, use } from 'react'

export const createAuthClient = (baseURL: string) =>
	betterAuthCreateAuthClient({
		baseURL,
	})

const authClientContext = createContext<ReturnType<typeof createAuthClient> | undefined>(undefined)

export const useAuthClient = () => {
	const authClient = use(authClientContext)

	if (!authClient) {
		throw new Error('useAuthClient must be used within an AuthClientProvider')
	}

	return authClient
}

export const AuthClientProvider = authClientContext.Provider
