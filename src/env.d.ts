// oxlint-disable typescript/consistent-type-definitions
/// <reference types="vite-plus/client" />

interface ImportMetaEnv {
	// Client-side environment variables
	readonly VITE_BETTER_AUTH_URL: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

// Server-side environment variables
declare global {
	namespace NodeJS {
		interface ProcessEnv {
			readonly BETTER_AUTH_SECRET: string
			readonly BETTER_AUTH_URL: string
			readonly OIDC_ISSUER: string
			readonly OIDC_CLIENT_ID: string
			readonly OIDC_CLIENT_SECRET: string
			readonly NODE_ENV: 'development' | 'production' | 'test'
		}
	}
}

export {}
