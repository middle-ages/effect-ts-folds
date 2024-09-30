import {monoEquivalence, testTypeclassLaws} from 'effect-ts-laws'
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
