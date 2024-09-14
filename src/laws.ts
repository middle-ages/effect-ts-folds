import {Equivalence as EQ} from 'effect'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Fix} from './fix.js'
import {Algebra} from './fold/folds.js'
import {Coalgebra} from './unfold/unfolds.js'

export interface Given<F extends TypeLambda, A> {
  equalsF: EQ.Equivalence<Fix<F>>
  equalsA: EQ.Equivalence<A>
  fixed: fc.Arbitrary<Fix<F>>
  a: fc.Arbitrary<A>
  φ: fc.Arbitrary<Algebra<F, A>>
  ψ: fc.Arbitrary<Coalgebra<F, A>>
}
