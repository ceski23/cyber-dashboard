import { Widget } from '#components/widget'
import { authMiddleware } from '#lib/auth/middleware'
import { configMiddleware } from '#lib/config/middleware'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { isNotNil } from 'es-toolkit'

import * as styles from './index.css'

const fetchData = createServerFn({ method: 'GET' })
	.middleware([configMiddleware])
	.handler(async ({ context: { config } }) => ({
		widgets: config.widgets,
	}))

const DashboardPage = () => {
	const { widgets } = Route.useLoaderData()

	return (
		<div className={styles.page}>
			<div className={styles.grid}>
				{widgets.map((definition, index) => {
					if ('widgets' in definition) {
						const cols = definition.columns ?? 1
						return (
							<div
								key={`group-${index}`}
								className={styles.group}
								style={{ gridColumn: `span ${cols}` }}
							>
								{isNotNil(definition.name) && (
									<div className={styles.groupHeader}>
										<span className={styles.groupLabel}>{definition.name}</span>
										<div className={styles.groupRule} />
									</div>
								)}
								<div
									className={styles.groupWidgets}
									style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
								>
									{definition.widgets.map(widgetDef => (
										<Widget
											key={widgetDef.id}
											definition={widgetDef}
										/>
									))}
								</div>
							</div>
						)
					}

					return (
						<Widget
							key={definition.id}
							definition={definition}
						/>
					)
				})}
			</div>
		</div>
	)
}

export const Route = createFileRoute('/_layout/')({
	server: {
		middleware: [authMiddleware],
	},
	loader: async () => await fetchData(),
	component: DashboardPage,
})
