import { assert } from '@std/assert'
import { exercise } from './exercise_tracker.ts'
import { z } from 'npm:zod'
import { generateUsername } from 'npm:unique-username-generator'
import { db, UserSchema } from './db.ts'

Deno.test('Routes', async (t) => {
  let id = ''
  const duration = () => (Math.floor(Math.random() * 100)).toString()
  await t.step('GET:USERLIST:EMPTY', async () => {
    const res = await exercise.request('/')
    const json = await res.json()
    const parsed = z.array(
      z.object({ username: z.string(), _id: z.string() }),
    )
      .safeParse(json)
    assert(parsed.success)
  }),
    await t.step('POST:USERLIST:EMPTY', async () => {
      const res = await exercise.request('/', { method: 'POST' })
      const text = await res.text()
      assert(text === 'Invalid!')
      assert(res.status === 401)
    }),
    await t.step('POST:USERLIST:INVALID', async () => {
      const res = await exercise.request('/', {
        method: 'POST',
        body: generateUsername(),
      })
      const text = await res.text()
      assert(text === 'Invalid!')
      assert(res.status === 401)
    }),
    await t.step('POST:USERLIST:VALID', async () => {
      const username = generateUsername()
      const body = new FormData()
      body.append('username', username)
      const res = await exercise.request('/', { method: 'POST', body })
      const json = await res.json()
      const parsed = z.object({ username: z.string(), _id: z.string() })
        .safeParse(json)
      id = json._id
      assert(parsed.success)
    }),
    await t.step('GET:USERLIST', async () => {
      const res = await exercise.request('/')
      const json = await res.json()
      const parsed = z.array(
        z.object({ username: z.string(), _id: z.string() }),
      )
        .safeParse(json)
      assert(parsed.success)
      assert(parsed.data.map((u) => u._id).includes(id))
    }),
    await t.step('POST:LOGS:VALID', async () => {
      const body = new FormData()
      body.append('description', 'swimming')
      body.append('duration', duration())
      console.log(body)
      const res = await exercise.request(`/${id}/exercises`, {
        method: 'POST',
        body,
      })
      const json = await res.json()
      const parsed = z.union([UserSchema, z.object({ _id: z.string() })])
        .safeParse(json)
      assert(parsed.success)
    }),
    await t.step('POST:LOGS:VALID', async () => {
      const body = new FormData()
      body.append('description', 'running')
      body.append('duration', duration())
      const res = await exercise.request(`/${id}/exercises`, {
        method: 'POST',
        body,
      })
      const json = await res.json()
      const parsed = z.union([UserSchema, z.object({ _id: z.string() })])
        .safeParse(json)
      assert(parsed.success)
    }),
    await t.step('POST:LOGS:INVALID', async () => {
      const body = new FormData()
      body.append('description', 'yoga')
      body.append('duration', duration())
      const res = await exercise.request(`/44444/exercises`, {
        method: 'POST',
        body,
      })
      const text = await res.text()
      assert(text === 'User not found!')
      assert(res.status === 404)
    }),
    await t.step('GET:LOGS:INVALID', async () => {
      const res = await exercise.request(`/44444/logs`)
      const text = await res.text()
      assert(text === 'User not found!')
      assert(res.status === 404)
    }),
    await t.step('GET:LOGS:VALID', async () => {
      const res = await exercise.request(`/${id}/logs`)
      const json = await res.json()
      const { success } = z.union([UserSchema, z.object({ _id: z.string() })])
        .safeParse(json)
      assert(success)
      // assert(data._id === id)
    }),
    await t.step('GET:LOGS:VALID:FROM', async () => {
      const res = await exercise.request(`/${id}/logs?from=2021-01-01`)
      const json = await res.json()
      const { success } = z.union([UserSchema, z.object({ _id: z.string() })])
        .safeParse(json)
      assert(success)
      // assert(data._id === id)
    }),
    await t.step('GET:LOGS:VALID:FROM', async () => {
      const res = await exercise.request(`/${id}/logs?to=2024-01-01`)
      const json = await res.json()
      const { success } = z.union([UserSchema, z.object({ _id: z.string() })])
        .safeParse(json)
      assert(success)
      // assert(data._id === id)
    }),
    await t.step('GET:LOGS:VALID:FROM', async () => {
      const res = await exercise.request(`/${id}/logs?limit=3`)
      const json = await res.json()
      const { success } = z.union([UserSchema, z.object({ _id: z.string() })])
        .safeParse(json)
      assert(success)
      // assert(data._id === id)
    }),
    db.users.delete(id)
})
