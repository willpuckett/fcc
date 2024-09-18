import { assert, assertStringIncludes } from '@std/assert'
import { header_parser } from './header_parser.ts'

Deno.test('Routes', async (t) => {
  await t.step('GET', async () => {
    const res = await header_parser.request('/', {
      headers: {
        'host': 'test',
        'accept-language': 'en-US,en;q=0.9',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    })
    const { ipaddress, language, software } = await res.json()
    console.log(ipaddress, language, software)
    assert(ipaddress == 'test')
    assertStringIncludes(language, 'en-US')
    assertStringIncludes(software, 'Windows NT 10.0; Win64; x64')
  }),
    await t.step('POST:EMPTY', async () => {
      const res = await header_parser.request('/', { method: 'POST' })
      const { status } = res
      assert(status == 404)
    })
})
