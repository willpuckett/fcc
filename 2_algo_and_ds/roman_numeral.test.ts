import { assert } from '@std/assert'
import { convertToRoman } from './roman_numeral.ts'

Deno.test('Roman Numerals', () => {
  const result = convertToRoman(36)
  const expected = 'XXXVI'
  assert(result === expected)
})
