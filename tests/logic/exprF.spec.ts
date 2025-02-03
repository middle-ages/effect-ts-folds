import {monoEquivalence} from 'effect-ts-laws'
import {testTypeclassLaws} from 'effect-ts-laws/vitest'
import {
  ExprFLambda,
  getArbitrary,
  getEquivalence,
  Traversable,
} from './exprF.js'

describe('exprF', () => {
  describe('laws', () => {
    testTypeclassLaws<ExprFLambda>({
      getEquivalence,
      getArbitrary: getArbitrary<string>(),
    })({
      Equivalence: getEquivalence(monoEquivalence),
      Traversable,
    })
  })
})
