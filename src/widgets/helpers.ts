import z from 'zod'

export type WidgetDefinition<TType extends string, TSchema extends z.ZodObject> = {
	type: TType
	optionsSchema: TSchema
	Component: React.ComponentType<z.infer<ReturnType<typeof baseWidgetSchema<TType>>> & { options: z.infer<TSchema> }>
}

export const baseWidgetSchema = <const T extends string>(type: T) =>
	z.strictObject({
		id: z.string().describe('A unique identifier for the widget.'),
		type: z.literal(type).describe('The type of the widget.'),
		title: z.string().optional().describe('The title of the widget.'),
		description: z.string().optional().describe('The description of the widget.'),
		columns: z.number().min(1).default(3).describe('The number of columns the widget spans.'),
	})

export const defineWidget = <const TType extends string, TSchema extends z.ZodObject>({
	Component,
	optionsSchema,
	type,
}: WidgetDefinition<TType, TSchema>) => ({
	type,
	Component,
	schema: baseWidgetSchema(type).extend({
		options: optionsSchema.describe('The configuration options for the widget.'),
	}),
})
