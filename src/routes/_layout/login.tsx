import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthClient } from '@/lib/auth/client'

const LoginPage = () => {
	const authClient = useAuthClient()

	const handleLogin = async () => {
		try {
			await authClient.signIn.social({
				provider: 'homelab-oidc',
				callbackURL: '/',
			})
		} catch (error) {
			console.error('Login error:', error)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-3xl font-bold tracking-tight">Homelab Dashboard</CardTitle>
					<CardDescription className="text-base">Sign in to access your dashboard</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<Button
						onClick={handleLogin}
						className="w-full"
						size="lg"
					>
						Sign In with SSO
					</Button>
					<p className="text-center text-sm text-muted-foreground">This dashboard uses OIDC authentication</p>
				</CardContent>
			</Card>
		</div>
	)
}

export const Route = createFileRoute('/_layout/login')({
	component: LoginPage,
})
