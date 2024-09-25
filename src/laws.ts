import {Equivalence as EQ} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Fix} from './fix.js'
import {Algebra, RAlgebra} from './fold/folds.js'
import {Coalgebra} from './unfold/unfolds.js'

export interface Given<F extends TypeLambda, A, B> {
  equalsF: EQ.Equivalence<Fix<F>>
  equalsA: EQ.Equivalence<A>
  a: fc.Arbitrary<A>
  fa: fc.Arbitrary<Kind<F, never, unknown, unknown, A>>
  fixed: fc.Arbitrary<Fix<F>>
  φ: fc.Arbitrary<Algebra<F, A>>
  ψ: fc.Arbitrary<Coalgebra<F, A>>
  ralgebra: fc.Arbitrary<RAlgebra<F, B[]>>
}
