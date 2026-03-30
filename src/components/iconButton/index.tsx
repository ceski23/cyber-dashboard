import clsx from 'clsx'
import type { ButtonHTMLAttributes, FunctionComponent } from 'react'
import * as styles from './style.css'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string
}

export const IconButton: FunctionComponent<IconButtonProps> = ({ className, children, ...props }) => (
	<button
		type="button"
		className={clsx(styles.root, className)}
		{...props}
	>
		{children}
	</button>
)
