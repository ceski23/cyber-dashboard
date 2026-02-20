import { isNotNil } from 'es-toolkit'
import { FunctionComponent } from 'react'
import { match, P } from 'ts-pattern'

import { useAuthClient } from '@/lib/auth/client'

import { styles } from './style.css'

export const User: FunctionComponent = () => {
	const authClient = useAuthClient()
	const { data: session, isPending } = authClient.useSession()

	return match([isPending, session?.user])
		.with([true, P.any], () => (
			<div className={styles.header.user.root}>
				<div className={styles.header.user.pending} />
			</div>
		))
		.with([false, P.nonNullable], ([, user]) => {
			const parts = user.name.split(' ')

			return isNotNil(user.image) ? (
				<div className={styles.header.user.root}>
					<img
						src={user.image}
						alt={user.name}
						className={styles.header.user.image}
					/>
				</div>
			) : (
				<div className={styles.header.user.root}>
					<span className={styles.header.user.text}>
						{parts.map(part => part.at(0)?.toUpperCase()).join('')}
					</span>
				</div>
			)
		})
		.otherwise(() => null)
}
