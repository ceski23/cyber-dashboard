import z from 'zod'

export type WidgetDefinition<TType extends string, TSchema extends z.ZodObject> = {
	type: TType
	optionsSchema: TSchema
	Component: React.ComponentType<z.infer<TSchema>>
	provideLinks?: (options: z.infer<TSchema>) => Array<{
		type: string
		label: string
		url: string
		icon?: string
	}>
}

export const defineWidget = <const TType extends string, TSchema extends z.ZodObject<{ type: z.ZodLiteral<TType> }>>({
	Component,
	optionsSchema,
	type,
	provideLinks,
}: WidgetDefinition<TType, TSchema>) => ({
	type,
	Component,
	schema: optionsSchema,
	provideLinks,
})

export const defineWidgetOptions = <const TType extends string, TSchema extends z.ZodObject>(
	type: TType,
	optionsSchema: TSchema,
) =>
	z.strictObject({
		id: z.string().describe('A unique identifier for the widget.'),
		type: z.literal(type).describe('The type of the widget.'),
		columns: z.number().min(1).default(3).describe('The number of columns the widget spans.'),
		options: optionsSchema.describe('The configuration options for the widget.'),
	})
