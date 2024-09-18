import { Hono } from '@hono/hono'
import { validator } from '@hono/hono/validator'
import { logger } from '@hono/hono/logger'
import { db, ExerciseSchema } from './db.ts'
import { z } from 'npm:zod'

// Hang routes at / in main.ts

export const exercise = new Hono()
  .use(logger())
  .post(
    '/',
    validator('form', (value, c) => {
      const parsed = z.object({ username: z.string() }).safeParse(value)
      if (!parsed.success) {
        return c.text('Invalid!', 401)
      }
      return parsed.data
    }),
    async (c) => {
      const { username } = c.req.valid('form')
      const _id = crypto.randomUUID()
      const { ok } = await db.users.set(_id, { username })
      return ok
        ? c.json({ username, _id })
        : c.text('Failed to create user!', 500)
    },
  )
  .get('/', async (c) => {
    const { result } = await db.users.map(({ id, value: { username } }) => ({
      username,
      _id: id,
    }))
    return c.json(result)
  })
  .post(
    '/:id/exercises',
    validator('form', (value, c) => {
      console.log(value)
      const { success, data , error} = ExerciseSchema.safeParse(value)
      console.log(success, data, error)
      return success ? data : c.text('Invalid!', 401)
    }),
    async (c) => {
      const id = c.req.param('id')
      const user = await db.users.find(id)
      if (!user) {
        return c.text('User not found!', 404)
      }
      let { count, log } = user.value
      log.push(c.req.valid('form'))
      count++
      const { ok } = await db.users.update(id, { count, log })
      return ok
        ? c.json({ ...user, _id: id })
        : c.text('Failed to add log entry.', 500)
    },
  )
  .get('/:id/logs', async (c) => {
    const id = c.req.param('id')
    const { from, to, limit } = c.req.query()
    const user = await db.users.find(id)
    if (!user) {
      return c.text('User not found!', 404)
    }
    const { value } = user
    value.log = value.log.filter(({ date }) => {
      const d = new Date(date!)
      const f = new Date(from)
      const t = new Date(to)
      if (from && d < f) return false
      if (to && d > t) return false
      return true
    })
    if (limit) {
      value.log = value.log.slice(0, parseInt(limit))
    }
    return c.json({ ...value, _id: id })
  })
