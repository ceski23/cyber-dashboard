import { z } from 'zod'
import { dockerOptions } from './docker/schema'
import { gatusOptions } from './gatus/schema'
import { pingOptions } from './ping/schema'

export const statusProviderSchema = z.union([dockerOptions, gatusOptions, pingOptions])
