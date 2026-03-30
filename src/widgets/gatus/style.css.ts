import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const pulse = keyframes({
	'0%': { opacity: 0.4 },
	'50%': { opacity: 1 },
	'100%': { opacity: 0.4 },
})

export const styles = {
	root: style({
		display: 'flex',
		flexDirection: 'column',
		height: vars.spacing[64],
	}),

	header: style({
		paddingBlock: vars.spacing[3],
		paddingInline: vars.spacing[4],
		gap: vars.spacing[2],
		flexShrink: 0,
		borderBottom: `1px solid ${vars.color.borderSubtle}`,
	}),

	icon: style({
		width: '18px',
		height: '18px',
		objectFit: 'contain',
		flexShrink: 0,
	}),

	skeletonGroupHeader: style({
		marginTop: vars.spacing[1],
	}),

	group: style({
		fontSize: vars.text.xs,
		fontWeight: 600,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
		paddingBlock: vars.spacing['0.5'],
		paddingInline: vars.spacing[4],
		marginTop: vars.spacing[3],
	}),

	row: style({
		transition: 'background 0.15s ease',
	}),

	rowLink: style({
		fontSize: vars.text.sm,
		fontWeight: 500,
		color: vars.color.foreground,
		flex: 1,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		textDecoration: 'none',
		':hover': {
			textDecoration: 'underline',
		},
	}),

	duration: style({
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
		flexShrink: 0,
	}),

	empty: style({
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		fontSize: vars.text.xs,
		color: vars.color.foregroundMuted,
	}),

	statusDot: recipe({
		base: {
			display: 'block',
			width: 8,
			height: 8,
			borderRadius: vars.radius.full,
			flexShrink: 0,
		},
		variants: {
			status: {
				available: {
					backgroundColor: vars.color.success,
					boxShadow: `0 0 4px ${transparentize(vars.color.success, 0.6)}`,
				},
				unavailable: {
					backgroundColor: vars.color.error,
					boxShadow: `0 0 4px ${transparentize(vars.color.error, 0.6)}`,
				},
				unknown: {
					backgroundColor: vars.color.foregroundMuted,
					animation: `${pulse} 1.5s ease-in-out infinite`,
				},
			},
		},
	}),

	tooltipContent: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[2],
		paddingInline: vars.spacing[2],
		paddingBlock: vars.spacing[1.5],
	}),

	tooltipName: style({
		fontSize: vars.text.sm,
		fontWeight: 600,
		color: vars.color.foreground,
	}),

	historyBlocks: style({
		display: 'grid',
		gridAutoFlow: 'row',
		gridTemplateColumns: 'repeat(auto-fill, minmax(10px, 1fr))',
		gap: '2px',
	}),

	historyBlock: recipe({
		base: {
			display: 'block',
			width: '100%',
			aspectRatio: '1 / 1',
			borderRadius: vars.radius.sm,
		},
		variants: {
			status: {
				pass: { backgroundColor: vars.color.success },
				fail: { backgroundColor: vars.color.error },
			},
		},
	}),

	historyStats: style({
		fontSize: vars.text.xxs,
		color: vars.color.foregroundMuted,
		fontVariantNumeric: 'tabular-nums',
	}),

	badgeTooltip: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[1.5],
		paddingInline: vars.spacing[2],
		paddingBlock: vars.spacing[1.5],
	}),

	badgeTooltipLabel: style({
		fontSize: vars.text.xxs,
		fontWeight: 600,
		color: vars.color.foregroundMuted,
		textTransform: 'uppercase',
		letterSpacing: '0.08em',
	}),

	badgeTooltipList: style({
		display: 'flex',
		flexDirection: 'column',
		gap: vars.spacing[0.5],
		listStyle: 'none',
		padding: 0,
		margin: 0,
	}),

	badgeTooltipItem: style({
		display: 'flex',
		alignItems: 'center',
		gap: vars.spacing[2],
		fontSize: vars.text.xs,
		color: vars.color.foreground,
	}),

	badgeTooltipDot: recipe({
		base: {
			width: 6,
			height: 6,
			flexShrink: 0,
			borderRadius: vars.radius.full,
		},
		variants: {
			status: {
				unavailable: { backgroundColor: vars.color.error },
				unknown: { backgroundColor: vars.color.foregroundMuted },
				available: { backgroundColor: vars.color.success },
			},
		},
	}),
}
