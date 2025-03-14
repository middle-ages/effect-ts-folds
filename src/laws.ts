import {Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Fix} from './fix.js'
import {Algebra, CVAlgebra, RAlgebra} from './fold/folds.js'
import {Coalgebra} from './unfold/unfolds.js'

export interface Given<F extends TypeLambda, A, B> {
  equalsF: EQ.Equivalence<Fix<F>>
  equalsA: EQ.Equivalence<A>
  equalsB: EQ.Equivalence<B>

  a: fc.Arbitrary<A>
  fa: fc.Arbitrary<Kind<F, never, unknown, unknown, A>>
  fixed: fc.Arbitrary<Fix<F>>

  φ: fc.Arbitrary<Algebra<F, A>>
  ψ: fc.Arbitrary<Coalgebra<F, A>>
  rAlgebra: fc.Arbitrary<RAlgebra<F, B[]>>
  cvAlgebra: fc.Arbitrary<CVAlgebra<F, A[]>>
}
