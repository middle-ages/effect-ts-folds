import {Traversable as TA} from '@effect/typeclass'
import {Effect as EF} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {EffectAlgebra} from '../fold/effect.js'
import {Algebra} from '../fold/folds.js'
import {EffectCoalgebra} from '../unfold/effect.js'
import {Coalgebra} from '../unfold/unfolds.js'

export type Hylomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E = unknown, R = unknown, I = never>(
  ψ: Coalgebra<F, A, E, R, I>,
  φ: Algebra<F, B, E, R, I>,
) => (a: A) => B

export type HylomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E1 = unknown, R1 = unknown, E2 = unknown, R2 = unknown, I2 = never>(
  ψ: EffectCoalgebra<F, A, E1, R1, E2, R2, I2>,
  φ: EffectAlgebra<F, B, E1, R1, E2, R2, I2>,
) => (a: A) => EF.Effect<B, E1, R1>
