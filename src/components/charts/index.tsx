import { Area, AreaChart, Line, LineChart, XAxis, YAxis } from 'recharts'

type ChartDatum = Record<string, string | number | Date | null>

type DataKey<T> = Extract<keyof T, string> | ((obj: T) => unknown)

type TypedLineProps<T extends ChartDatum> = Omit<React.ComponentProps<typeof Line>, 'dataKey'> & {
	dataKey?: DataKey<T>
}

type TypedAreaProps<T extends ChartDatum> = Omit<React.ComponentProps<typeof Area>, 'dataKey'> & {
	dataKey: DataKey<T>
}

type TypedLineChartProps<T extends ChartDatum> = Omit<React.ComponentProps<typeof LineChart>, 'data'> & {
	data?: ReadonlyArray<T> | undefined
}

type TypedAreaChartProps<T extends ChartDatum> = Omit<React.ComponentProps<typeof AreaChart>, 'data'> & {
	data?: ReadonlyArray<T> | undefined
}

type TypedXAxisProps<T extends ChartDatum, TDataKey extends DataKey<T>> = Omit<
	React.ComponentProps<typeof XAxis>,
	'dataKey' | 'tickFormatter'
> & {
	dataKey?: TDataKey
	tickFormatter?: (
		value: TDataKey extends (val: T) => infer R ? R : TDataKey extends keyof T ? T[TDataKey] : never,
		index: number,
	) => string
}

type TypedYAxisProps<T extends ChartDatum, TDataKey extends DataKey<T>> = Omit<
	React.ComponentProps<typeof YAxis>,
	'dataKey' | 'tickFormatter'
> & {
	dataKey?: TDataKey
	tickFormatter?: (
		value: TDataKey extends (val: T) => infer R ? R : TDataKey extends keyof T ? T[TDataKey] : never,
		index: number,
	) => string
}

export const createTypedChart = <T extends ChartDatum>() => ({
	Line: (props: TypedLineProps<T>) => <Line {...props} />,
	// @ts-expect-error - Recharts types are not generic, so we need to ignore the type error here
	Area: (props: TypedAreaProps<T>) => <Area {...props} />,
	LineChart: (props: TypedLineChartProps<T>) => <LineChart {...props} />,
	AreaChart: (props: TypedAreaChartProps<T>) => <AreaChart {...props} />,
	// @ts-expect-error - Recharts types are not generic, so we need to ignore the type error here
	XAxis: <TDataKey extends DataKey<T>>(props: TypedXAxisProps<T, TDataKey>) => <XAxis {...props} />,
	// @ts-expect-error - Recharts types are not generic, so we need to ignore the type error here
	YAxis: <TDataKey extends DataKey<T>>(props: TypedYAxisProps<T, TDataKey>) => <YAxis {...props} />,
})
