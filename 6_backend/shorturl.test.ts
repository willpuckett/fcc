import { assert } from '@std/assert'
import { shorturl } from './shorturl.ts'

Deno.test('Routes', async (t) => {
  const test_url = 'https://apple.com'
  let test_return_url = ''
  await t.step('GET', async () => {
    const res = await shorturl.request('/1234')
    const { error } = await res.json()
    assert(error === 'invalid url')
  }),
    await t.step('POST', async () => {
      const res = await shorturl.request('/', {
        method: 'POST',
        body: test_url,
      })
      const { original_url, short_url } = await res.json()
      test_return_url = short_url
      assert(original_url == test_url)
    }),
    await t.step('GET:EXAMPLE', async () => {
      const res = await shorturl.request(`/${test_return_url}`)
      assert(res.status == 302)
      assert(res.headers.get('location') == test_url)
    })
})
