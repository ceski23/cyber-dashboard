import * as styles from './style.css'

type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral'

type BadgeProps = {
	text: string
	variant: BadgeVariant
	withDot?: boolean
}

export const Badge = ({ text, variant, withDot, ...props }: BadgeProps) => (
	<span
		className={styles.badge({ variant })}
		{...props}
	>
		{withDot === true && <span className={styles.dot} />}
		{text}
	</span>
)
