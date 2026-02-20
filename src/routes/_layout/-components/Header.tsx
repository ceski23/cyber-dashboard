import { Link } from '@tanstack/react-router'
import type { ComponentProps, FunctionComponent } from 'react'

import { CommandPalette } from './CommandPalette'
import { styles } from './style.css'
import { User } from './User'

type HeaderProps = {
	title: string
	links: ComponentProps<typeof CommandPalette>['links']
}

export const Header: FunctionComponent<HeaderProps> = ({ title, links }) => (
	<header className={styles.header.root}>
		<div className={styles.header.left}>
			<Link
				to="/"
				className={styles.header.title}
			>
				{title}
			</Link>
		</div>
		{/* TODO: Display only after auth resolved */}
		<CommandPalette links={links} />
		<div className={styles.header.right}>
			<User />
		</div>
	</header>
)
