import { assert } from '@std/assert'
import { telephoneCheck } from './tele_num_validator.ts'
Deno.test('Telephone Number Validator', () => {
  const result = telephoneCheck('555-555-5555')
  const expected = true
  assert(result === expected)
})
