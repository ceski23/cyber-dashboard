import clsx from 'clsx'
import type { FunctionComponent, PropsWithChildren } from 'react'
import * as styles from './style.css'

type RootProps = PropsWithChildren<{ className?: string }>

const Root: FunctionComponent<RootProps> = ({ className, children, ...props }) => (
	<div
		className={clsx(styles.root, className)}
		{...props}
	>
		{children}
	</div>
)

type ItemProps = PropsWithChildren<{ className?: string }>

const Item: FunctionComponent<ItemProps> = ({ className, children, ...props }) => (
	<div
		className={clsx(styles.item, className)}
		{...props}
	>
		{children}
	</div>
)

export const List = Object.assign({}, { Root, Item })
