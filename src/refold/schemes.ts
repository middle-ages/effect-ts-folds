import {Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {traverseSuspended} from '../cont.js'
import {EffectAlgebra} from '../fold/effect.js'
import {Algebra} from '../fold/folds.js'
import {EffectCoalgebra} from '../unfold/effect.js'
import {Coalgebra} from '../unfold/unfolds.js'
import {Hylomorphism, HylomorphismE} from './refolds.js'

export const hyloE: HylomorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: EffectCoalgebra<F, A, E, R, Out1, Out2, In1>,
    φ: EffectAlgebra<F, B, E, R, Out1, Out2, In1>,
  ): ((a: A) => EF.Effect<B, E, R>) => {
    const run: (a: A) => EF.Effect<B, E, R> = a =>
      pipe(a, ψ, EF.flatMap(traverseSuspended(F)(run)), EF.flatMap(φ))

    return run
  }

export const hylo: Hylomorphism =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: Coalgebra<F, A, Out1, Out2, In1>,
    φ: Algebra<F, B, Out1, Out2, In1>,
  ) =>
    flow(
      hyloE(F)<A, B, never, never, Out1, Out2, In1>(
        flow(ψ, EF.succeed),
        flow(φ, EF.succeed),
      ),
      EF.runSync,
    )
