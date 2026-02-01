import { z } from 'zod'

const serverEnvSchema = z.object({
	BETTER_AUTH_SECRET: z.string().min(1).describe('The secret used to sign Better Auth tokens'),
	BETTER_AUTH_URL: z.string().url().describe('The base URL of the Better Auth server'),
	OIDC_ISSUER: z.string().url().optional().describe('The OIDC issuer URL'),
	OIDC_CLIENT_ID: z.string().optional().describe('The OIDC client ID'),
	OIDC_CLIENT_SECRET: z.string().optional().describe('The OIDC client secret'),
	PORT: z.coerce.number().int().positive().default(3000).describe('The port the server runs on'),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development').describe('The Node environment'),
})

// Validate server environment
export const serverEnv = serverEnvSchema.parse(process.env)
