import {pipe} from 'effect'
import {cata} from 'effect-ts-folds'
import {constant} from 'effect/Function'
import {
  Cons,
  ConsF,
  empty,
  fromArray,
  instances,
  match,
  singleton,
  toArray,
} from './data.js'

describe('consList', () => {
  test('from/toArray', () => {
    expect(pipe([1, 2, 3], fromArray, toArray)).toEqual([1, 2, 3])
  })
  describe('schemes', () => {
    const consCata = cata(instances)

    describe('count cata', () => {
      const fold: (l: ConsF<number>) => number = match(
        constant(0),
        (_, tail) => tail + 1,
      )

      const count: (fixed: Cons) => number = consCata(fold)

      test('empty', () => {
        expect(count(empty)).toEqual(0)
      })

      test('singleton', () => {
        expect(count(singleton(42))).toEqual(1)
      })

      test('1,2,3', () => {
        expect(count(fromArray([1, 2, 3]))).toEqual(3)
      })
    })
  })
})
