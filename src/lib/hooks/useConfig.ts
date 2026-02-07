import { getRouteApi } from '@tanstack/react-router'

const IndexRoute = getRouteApi('/_layout/')

export const useConfig = () => IndexRoute.useRouteContext().config
