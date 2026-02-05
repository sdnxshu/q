import { Hono } from 'hono'

import { health } from './health'
import { notifications } from './notifications'

const api = new Hono()

api.route("/health", health)
api.route("/notify", notifications)

export { api }
