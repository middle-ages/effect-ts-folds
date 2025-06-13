import {succeedBy} from '#util'
import {Traversable} from '@effect/typeclass'
import {getApplicative} from '@effect/typeclass/data/Effect'
import {Effect, HKT, pipe} from 'effect'
import {EffectAlgebra} from '../fold.js'
import {EffectCoalgebra} from '../unfold.js'
import {Hylomorphism, HylomorphismE} from './refolds.js'

export const hyloE: HylomorphismE =
  <F extends HKT.TypeLambda>(F: Traversable.Traversable<F>) =>
  <A, B, E1 = unknown, R1 = unknown, E2 = unknown, R2 = unknown, I2 = never>(
    ψ: EffectCoalgebra<F, A, E1, R1, E2, R2, I2>,
    φ: EffectAlgebra<F, B, E1, R1, E2, R2, I2>,
  ) => {
    const traverse = F.traverse(getApplicative())
    const run = (a: A): Effect.Effect<B, E1, R1> =>
      pipe(
        a,
        ψ,
        Effect.flatMap(self => Effect.suspend(() => pipe(self, traverse(run)))),
        Effect.flatMap(φ),
      )

    return run
  }

export const hylo: Hylomorphism = F => (ψ, φ) => a =>
  pipe(a, hyloE(F)(succeedBy(ψ), succeedBy(φ)), Effect.runSync)
