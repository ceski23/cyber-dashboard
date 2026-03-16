import clsx from 'clsx'
import type { FunctionComponent } from 'react'
import type { PropsWithChildren } from 'react'
import * as styles from './style.css'

type RowProps = PropsWithChildren<{
	className?: string
}>

const Row: FunctionComponent<RowProps> = ({ className, children, ...props }) => (
	<div
		className={clsx(styles.root, className)}
		{...props}
	>
		{children}
	</div>
)

type ItemProps = {
	value: string
	label: string
	className?: string
}

const Item: FunctionComponent<ItemProps> = ({ value, label, className, ...props }) => (
	<div
		className={clsx(styles.item, className)}
		{...props}
	>
		<span className={styles.value}>{value}</span>
		<span className={styles.label}>{label}</span>
	</div>
)

export const Stat = Object.assign(
	{},
	{
		Row,
		Item,
	},
)
