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
      const { success, data } = ExerciseSchema.safeParse(value)
      return success ? data : c.text('Invalid!', 401)
    }),
    async (c) => {
      const _id = c.req.param('id')
      const record = await db.users.find(_id)
      if (!record) {
        return c.text('User not found!', 404)
      }
      const { value } = record
      value.log.push(c.req.valid('form'))
      value.count++
      const { username, count, log } = value
      const { ok } = await db.users.update(_id, { count, log })
      const json = { _id, username, ...c.req.valid('form') }
      console.log(JSON.stringify(json))
      return ok ? c.json(json) : c.text('Failed to add log entry.', 500)
    },
  )
  // {
  //   username: "fcc_test",
  //   description: "test",
  //   duration: 60,
  //   date: "Mon Jan 01 1990",
  //   _id: "5fb5853f734231456ccb3b05"
  // }
  .get('/:id/logs', async (c) => {
    const _id = c.req.param('id')
    const { from, to, limit } = c.req.query()
    const record = await db.users.find(_id)
    if (!record) {
      return c.text('User not found!', 404)
    }
    const { value } = record
    console.log(value.log)
    value.log = value.log.filter(({ date }) => {
      const d = new Date(date)
      const f = new Date(from)
      const t = new Date(to)
      if (from && d < f) return false
      if (to && d > t) return false
      return true
    })
    console.log(value.log, )
    if (limit) {
      value.log = value.log.slice(0, parseInt(limit))
    }
    console.log(c.req.query(), value)
    return c.json({ _id, ...value,  count: value.log.length})
  })
