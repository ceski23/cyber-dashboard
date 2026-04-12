import type { DashboardItem, DashboardWidget } from './schema'

export const flattenDashboardWidgets = (items: DashboardItem[]): DashboardWidget[] =>
	items.flatMap(item => ('widgets' in item ? flattenDashboardWidgets(item.widgets) : [item]))
