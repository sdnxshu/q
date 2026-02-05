import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { poweredBy } from 'hono/powered-by'

import { api } from './routes'

const app = new Hono()

app.use(logger())
app.use(poweredBy())

app.use('*', cors())

app.get('/', (c) => { return c.text('Hello Hono!') })

app.route('/api', api)

export default app