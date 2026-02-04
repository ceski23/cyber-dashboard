import { Line, LineChart, XAxis, YAxis } from 'recharts'

type ChartDatum = Record<string, string | number | Date | null>

type DataKey<T> = Extract<keyof T, string> | ((obj: T) => unknown) | undefined

type TypedLineProps<T extends ChartDatum> = Omit<React.ComponentProps<typeof Line>, 'dataKey'> & {
	dataKey?: DataKey<T>
}

type TypedLineChartProps<T extends ChartDatum> = Omit<React.ComponentProps<typeof LineChart>, 'data'> & {
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
	LineChart: (props: TypedLineChartProps<T>) => <LineChart {...props} />,
	XAxis: <TDataKey extends DataKey<T>>(props: TypedXAxisProps<T, TDataKey>) => <XAxis {...props} />,
	YAxis: <TDataKey extends DataKey<T>>(props: TypedYAxisProps<T, TDataKey>) => <YAxis {...props} />,
})
