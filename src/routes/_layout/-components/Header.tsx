import { Link } from '@tanstack/react-router'
import type { ComponentProps, FunctionComponent } from 'react'
import lightIcon from '../../../assets/icon-light.svg?url'
import darkIcon from '../../../assets/icon.svg?url'
import { AdaptiveIcon } from '../../../components/AdaptiveIcon'
import { CommandPalette } from './CommandPalette'
import { styles } from './style.css'
import { ThemeToggle } from './ThemeToggle'

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
				<AdaptiveIcon
					src={{ light: lightIcon, dark: darkIcon }}
					alt={title}
					width={32}
					height={32}
					className={styles.header.logo}
				/>
				<span className={styles.header.titleText}>{title}</span>
			</Link>
		</div>
		{/* TODO: Display only after auth resolved */}
		<CommandPalette links={links} />
		<div className={styles.header.right}>
			<ThemeToggle />
		</div>
	</header>
)
