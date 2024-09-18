import { Context, Hono } from '@hono/hono'
import { logger } from '@hono/hono/logger'

// Hang routes at /api in main.ts

export const timestamp = new Hono()
  .use(logger())
  .get('/:date?', (c: Context) => {
    const d = c.req.param('date')
    // const parsed = schema.safeParse(d).data
    const date = d ? new Date(d) : new Date()
    console.log(d, date)
    return c.json(
      date.toString() === 'Invalid Date'
        ? { error: 'Invalid Date' }
        : { unix: date.getTime(), utc: date.toUTCString() },
    )
  })
