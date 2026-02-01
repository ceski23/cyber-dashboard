import { createFileRoute } from '@tanstack/react-router'

import { authMiddleware } from '@/lib/auth/middleware'

export const Route = createFileRoute('/')({
	server: {
		middleware: [authMiddleware],
	},
	component: () => (
		<div className="min-h-screen bg-gray-900">
			<div className="container mx-auto p-6">
				<h1 className="mb-6 text-3xl font-bold text-white">Homelab Dashboard</h1>
				<div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
					<p className="text-gray-300">Dashboard widgets will be displayed here.</p>
				</div>
			</div>
		</div>
	),
})
