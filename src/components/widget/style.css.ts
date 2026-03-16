import { transparentize } from '#lib/utils/style'
import { vars } from '#theme.css'
import { style } from '@vanilla-extract/css'

export const styles = {
	errorRoot: style({
		height: vars.spacing[32],
	}),

	errorContent: style({
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		gap: vars.spacing[4],
		color: vars.color.red[400],
		fontSize: vars.text.sm,
	}),

	errorMessage: style({
		color: 'inherit',
		opacity: 0.8,
		flex: 1,
	}),

	errorButton: style({
		paddingInline: vars.spacing[3],
		paddingBlock: vars.spacing[1.5],
		borderRadius: vars.radius.md,
		border: `1px solid ${transparentize(vars.color.red[500], 0.3)}`,
		background: transparentize(vars.color.red[500], 0.1),
		color: vars.color.red[400],
		fontSize: vars.text.xs,
		cursor: 'pointer',
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: vars.spacing[2],
		transition: 'background-color 0.2s ease',
		':hover': {
			background: transparentize(vars.color.red[500], 0.2),
		},
	}),

	errorHeader: style({
		display: 'flex',
		alignItems: 'flex-start',
		gap: vars.spacing[2],
		marginRight: 'auto',
	}),
}
