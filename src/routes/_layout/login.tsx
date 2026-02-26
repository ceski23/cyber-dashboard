import { useAuthClient } from '#lib/auth/client'
import { createFileRoute } from '@tanstack/react-router'
import z from 'zod'

const LoginPage = () => {
	const authClient = useAuthClient()

	const handleLogin = async () => {
		try {
			// TODO: Handle redirect after login
			await authClient.signIn.social({
				provider: 'homelab-oidc',
				callbackURL: '/',
			})
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	return <button onClick={handleLogin}>Sign In with SSO</button>
}

export const Route = createFileRoute('/_layout/login')({
	component: LoginPage,
	validateSearch: z.object({
		redirect: z.string().optional(),
	}),
})
