import { assert } from '@std/assert'
import { checkCashRegister } from './cash_register.ts'

Deno.test('Cash Register:OPEN', () => {
  const result = checkCashRegister(19.5, 20, [
    ['PENNY', 1.01],
    ['NICKEL', 2.05],
    ['DIME', 3.1],
    ['QUARTER', 4.25],
    ['ONE', 90],
    ['FIVE', 55],
    ['TEN', 20],
    ['TWENTY', 60],
    ['ONE HUNDRED', 100],
  ])
  const expected = { status: 'OPEN', change: [['QUARTER', 0.5]] }
  assert(JSON.stringify(result) === JSON.stringify(expected))
})
Deno.test('Cash Register:INSUFFICIENT_FUNDS', () => {
  const result = checkCashRegister(19.5, 20, [
    ['PENNY', 0.01],
    ['NICKEL', 0],
    ['DIME', 0],
    ['QUARTER', 0],
    ['ONE', 0],
    ['FIVE', 0],
    ['TEN', 0],
    ['TWENTY', 0],
    ['ONE HUNDRED', 0],
  ])
  const expected = { status: 'INSUFFICIENT_FUNDS', change: [] }
  assert(JSON.stringify(result) === JSON.stringify(expected))
})
Deno.test('Cash Register:CLOSED', () => {
  const result = checkCashRegister(19.5, 20, [
    ['PENNY', 0.5],
    ['NICKEL', 0],
    ['DIME', 0],
    ['QUARTER', 0],
    ['ONE', 0],
    ['FIVE', 0],
    ['TEN', 0],
    ['TWENTY', 0],
    ['ONE HUNDRED', 0],
  ])
  const expected = { status: 'CLOSED', change: [['PENNY', 0.5]] }
  console.log(expected, result)
  assert(JSON.stringify(result) === JSON.stringify(expected))
})
