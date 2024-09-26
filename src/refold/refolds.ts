import {Traversable as TA} from '@effect/typeclass'
import {Effect as EF} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {EffectAlgebra} from '../fold/effect.js'
import {Algebra} from '../fold/folds.js'
import {EffectCoalgebra} from '../unfold/effect.js'
import {Coalgebra} from '../unfold/unfolds.js'

export type Hylomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: Coalgebra<F, A, Out1, Out2, In1>,
  φ: Algebra<F, B, Out1, Out2, In1>,
) => (a: A) => B

export type HylomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: EffectCoalgebra<F, A, E, R, Out1, Out2, In1>,
  φ: EffectAlgebra<F, B, E, R, Out1, Out2, In1>,
) => (a: A) => EF.Effect<B, E, R>
