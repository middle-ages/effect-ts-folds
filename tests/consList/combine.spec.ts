import {pipe} from 'effect'
import {Algebra, struct, zipFolds} from 'effect-ts-folds'
import {TupleOf} from 'effect/Types'
import {cons} from './cons.js'
import {ConsFLambda, instances} from './consF.js'
import {consCata, count, max, product, sum} from './schemes.js'

describe('combine', () => {
  describe('algebras', () => {
    test('zipFolds', () => {
      const fold: Algebra<ConsFLambda, TupleOf<4, number>> = zipFolds(
        instances,
      )(count, sum, product, max)

      expect(pipe([1, 2, 3, 4], cons, consCata(fold))).toEqual([
        4,
        1 + 2 + 3 + 4,
        1 * 2 * 3 * 4,
        4,
      ])
    })

    test('struct', () => {
      const fold: Algebra<
        ConsFLambda,
        Record<'count' | 'sum' | 'product' | 'max', number>
      > = pipe({count, sum, product, max}, struct(instances))

      const actual = pipe([1, 2, 3, 4], cons, consCata(fold))

      expect(actual).toEqual({
        count: 4,
        sum: 1 + 2 + 3 + 4,
        product: 1 * 2 * 3 * 4,
        max: 4,
      })
    })
  })
})
