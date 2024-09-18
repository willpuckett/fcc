import { assert } from '@std/assert/assert'
import { timestamp } from './timestamp.ts'

Deno.test('Routes', async (t) => {
  await t.step('GET:STRING', async () => {
    const res = await timestamp.request('/fbjjrk')
    const { error } = await res.json()
    assert(error === 'Invalid Date')
  }),
    await t.step('GET:NUMBER', async () => {
      const res = await timestamp.request('/1234567890')
      const { error } = await res.json()
      assert(error === 'Invalid Date')
    }),
    await t.step('POST', async () => {
      const res = await timestamp.request('/', {
        method: 'POST',
      })
      assert(res.status == 404)
    }),
    await t.step('GET:CURRENT_TIME', async () => {
      const res = await timestamp.request('/')
      const { unix, utc } = await res.json()
      const unixDate = new Date(unix)
      const utcDate = new Date(utc)

      const now = new Date()
      assert(res.status == 200)
      assert(unixDate.getUTCDate() === now.getUTCDate())
      assert(utcDate.getUTCDate() === now.getUTCDate())
      assert(unixDate.getUTCMonth() === now.getUTCMonth())
      assert(utcDate.getUTCMonth() === now.getUTCMonth())
      assert(unixDate.getUTCFullYear() === now.getUTCFullYear())
      assert(utcDate.getUTCFullYear() === now.getUTCFullYear())
    })
})
