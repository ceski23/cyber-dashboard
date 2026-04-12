import type { QueryClient } from '@tanstack/react-query'
import z from 'zod'

export type WidgetDefinition<TType extends string, TSchema extends z.ZodObject> = {
	type: TType
	optionsSchema: TSchema
	Component: React.ComponentType<z.infer<TSchema>>
	provideLinks?: (options: z.infer<TSchema['shape']['options']>) => Array<{
		type: string
		label: string
		url: string
		icon?: string
	}>
	loader?: (queryClient: QueryClient, options: z.infer<TSchema['shape']['options']>) => Promise<void>
}

export const defineWidget = <const TType extends string, TSchema extends z.ZodObject<{ type: z.ZodLiteral<TType> }>>({
	Component,
	optionsSchema,
	type,
	provideLinks,
	loader,
}: WidgetDefinition<TType, TSchema>) => ({
	type,
	Component,
	schema: optionsSchema,
	provideLinks,
	loader,
})

export const defineWidgetOptions = <const TType extends string, TSchema extends z.ZodObject>(
	type: TType,
	optionsSchema: TSchema,
) =>
	z.strictObject({
		type: z.literal(type).describe('The type of the widget.'),
		columns: z.number().min(1).default(3).describe('The number of columns the widget spans.'),
		options: optionsSchema.describe('The configuration options for the widget.'),
	})
