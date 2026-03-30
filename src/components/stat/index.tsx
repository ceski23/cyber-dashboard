import clsx from 'clsx'
import type { CSSProperties, FunctionComponent } from 'react'
import type { PropsWithChildren } from 'react'
import * as styles from './style.css'

type RowProps = PropsWithChildren<{
	className?: string
	columns?: number
	style?: CSSProperties
}>

const Row: FunctionComponent<RowProps> = ({ className, columns = 3, children, style, ...props }) => (
	<div
		className={clsx(styles.root, className)}
		style={{ gridTemplateColumns: `repeat(${columns}, 1fr)`, ...style }}
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
