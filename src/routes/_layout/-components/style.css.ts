import { transparentize } from '#lib/utils/style'
import { media, vars } from '#theme.css'
import { globalStyle, keyframes, style } from '@vanilla-extract/css'

export const pulse = keyframes({
	'0%': { opacity: 0.5 },
	'50%': { opacity: 1 },
	'100%': { opacity: 0.5 },
})

export const styles = {
	header: {
		root: style({
			height: '64px',
			borderBottom: `1px solid ${vars.color.borderSubtle}`,
			display: 'flex',
			alignItems: 'center',
			paddingLeft: vars.spacing[6],
			paddingRight: vars.spacing[6],
			background: transparentize(vars.color.background, 0.2),
			backdropFilter: 'blur(8px)',
			gap: vars.spacing[4],
			'@media': {
				[media.lg]: {
					paddingLeft: vars.spacing[8],
					paddingRight: vars.spacing[8],
				},
			},
		}),
		left: style({
			display: 'flex',
			flex: 1,
			justifyContent: 'flex-start',
			minWidth: 0,
		}),
		right: style({
			display: 'flex',
			flex: 1,
			alignItems: 'center',
			justifyContent: 'flex-end',
			gap: vars.spacing[2],
			minWidth: 0,
		}),
		title: style({
			fontSize: vars.text.xl,
			fontWeight: 600,
			transition: 'color 0.2s',
			color: vars.color.foreground,
			textDecoration: 'none',
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			':hover': {
				color: vars.color.primary,
			},
		}),
		user: {
			root: style({
				width: '32px',
				aspectRatio: '1 / 1',
				borderRadius: vars.radius.full,
				border: `1px solid ${vars.color.border}`,
				backgroundColor: vars.color.backgroundAlt,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				overflow: 'hidden',
			}),
			text: style({
				fontSize: vars.text.xs,
				fontWeight: 700,
				color: vars.color.foregroundMuted,
			}),
			image: style({
				width: '100%',
				height: '100%',
				borderRadius: 'inherit',
				objectFit: 'cover',
			}),
			pending: style({
				backgroundColor: vars.color.border,
				animation: `${pulse} 1.5s ease-in-out infinite`,
				width: '100%',
				height: '100%',
			}),
		},
	},
	commandPalette: {
		trigger: {
			root: style({
				display: 'flex',
				alignItems: 'center',
				minWidth: '200px',
				gap: vars.spacing[2],
				paddingBlock: vars.spacing[1.5],
				paddingInline: vars.spacing[3],
				borderRadius: vars.radius.lg,
				border: `1px solid ${vars.color.border}`,
				backgroundColor: transparentize(vars.color.foreground, 0.05),
				color: vars.color.foregroundMuted,
				fontSize: vars.text.xs,
				cursor: 'pointer',
				transition: 'background-color 0.2s, color 0.2s',
				':hover': {
					backgroundColor: transparentize(vars.color.foreground, 0.1),
					color: vars.color.foregroundAlt,
				},
			}),
			hotkey: style({
				marginLeft: 'auto',
			}),
		},
		overlay: style({
			position: 'fixed',
			inset: 0,
			backgroundColor: transparentize(vars.color.background, 0.8),
			opacity: 1,
			transition: 'opacity 0.3s ease',
			selectors: {
				'&:is([data-starting-style], [data-ending-style])': {
					opacity: 0,
				},
			},
		}),
		dialog: style({
			width: '100%',
			maxWidth: '32rem',
			position: 'fixed',
			top: '20vh',
			left: '50%',
			transform: 'translate(-50%, 0)',
			borderRadius: vars.radius.xl,
			border: `1px solid ${vars.color.border}`,
			backgroundColor: '#18181b',
			boxShadow: vars.shadow.panel,
			opacity: 1,
			transition: 'opacity 0.3s ease, transform 0.2s ease',
			selectors: {
				'&:is([data-starting-style], [data-ending-style])': {
					opacity: 0,
					transform: 'translate(-50%, 5%)',
				},
			},
		}),
		input: style({
			flex: 1,
			appearance: 'none',
			background: vars.color.transparent,
			border: 'none',
			outline: 'none',
			color: vars.color.foregroundAlt,
			fontSize: vars.text.sm,
			padding: vars.spacing[4],
		}),
		inputWrapper: style({
			display: 'flex',
			alignItems: 'center',
			paddingInline: vars.spacing[4],
			borderBottom: `1px solid ${vars.color.borderSubtle}`,
			color: vars.color.foregroundMuted,
		}),
		list: style({
			maxHeight: 300,
			overflowY: 'auto',
			padding: vars.spacing[2],
		}),
		group: style({
			marginBottom: vars.spacing[2],
		}),
		empty: style({
			padding: vars.spacing[8],
			textAlign: 'center',
			color: vars.color.foregroundMuted,
			fontSize: vars.text.sm,
		}),
		item: {
			root: style({
				display: 'flex',
				alignItems: 'center',
				gap: vars.spacing[3],
				paddingBlock: vars.spacing[2],
				paddingInline: vars.spacing[3],
				borderRadius: vars.radius.lg,
				cursor: 'pointer',
				color: vars.color.foregroundMuted,
				fontSize: vars.text.sm,
				textDecoration: 'none',
				transition: 'background-color 0.2s, color 0.2s',
				selectors: {
					'&[data-selected=true]': {
						backgroundColor: transparentize(vars.color.foreground, 0.05),
						color: vars.color.foregroundAlt,
					},
				},
			}),
			icon: style({
				width: '18px',
				height: '18px',
			}),
			hotkey: style({
				marginLeft: 'auto',
			}),
		},
	},
}

globalStyle(`${styles.commandPalette.group} > [cmdk-group-heading]`, {
	fontSize: vars.text.xxs,
	fontWeight: 700,
	textTransform: 'uppercase',
	letterSpacing: '0.08em',
	color: vars.color.foregroundMuted,
	paddingInline: vars.spacing[2],
	paddingBlock: vars.spacing[1.5],
})
