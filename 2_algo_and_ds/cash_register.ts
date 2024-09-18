type Denom = [string, number]
type Drawer = Denom[]

const values: Drawer = [
  ['ONE HUNDRED', 100],
  ['TWENTY', 20],
  ['TEN', 10],
  ['FIVE', 5],
  ['ONE', 1],
  ['QUARTER', 0.25],
  ['DIME', 0.10],
  ['NICKEL', 0.05],
  ['PENNY', 0.01],
]

export const checkCashRegister = (price: number, cash: number, cid: Drawer) => {
  let change = cash - price
  const drawer = cid.reduce((a, [_, b]) => a + b, 0)
  if (drawer == change) {
    return {
      status: 'CLOSED',
      change: cid.filter(([_, value]) => value > 0),
    }
  }
  if (drawer < change) return { status: 'INSUFFICIENT_FUNDS', change: [] }
  const transaction = cid
    .reverse()
    .map<Denom>(([denom, value], i) => {
      const v = values[i][1]
      const onHand = v * Math.floor(change / v)
      const denomChange = change < v ? 0 : onHand < value ? onHand : value
      change -= denomChange
      return [denom, denomChange]
    })
    .filter(([_, value]) => value > 0)
  return { status: 'OPEN', change: transaction }
}

// const check = checkCashRegister(19.5, 20, [
//   ['PENNY', 1.01],
//   ['NICKEL', 2.05],
//   ['DIME', 3.1],
//   ['QUARTER', 4.25],
//   ['ONE', 90],
//   ['FIVE', 55],
//   ['TEN', 20],
//   ['TWENTY', 60],
//   ['ONE HUNDRED', 100],
// ])
// console.log(check)
