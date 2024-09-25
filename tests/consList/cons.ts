import {Array as AR, Equivalence as EQ, Number as NU, pipe} from 'effect'
import {fix, Fix, unfix} from 'effect-ts-folds'
import fc from 'fast-check'
import {ConsFLambda} from './consF.js'

export type Cons = Fix<ConsFLambda>

export const empty: Cons = fix(null)

export const of: (n: number) => Cons = n => fix([empty, n])

export const prepend: (l: Cons, n: number) => Cons = (l, n) => fix([l, n])

export const cons: (ns: number[]) => Cons = ns =>
  pipe(ns, AR.reverse, AR.reduce(empty, prepend))

export const toArray: (c: Cons) => number[] = c => {
  const result: number[] = []
  let current = unfix(c)
  while (current !== null) {
    const [tail, head] = current
    result.push(head)
    current = unfix(tail)
  }
  return result
}

export const arbitrary: fc.Arbitrary<Cons> = fc
  .array(fc.integer({min: 0, max: 4}), {maxLength: 4})
  .map(cons)

export const equivalence: EQ.Equivalence<Cons> = pipe(
  NU.Equivalence,
  AR.getEquivalence,
  EQ.mapInput(toArray),
)
