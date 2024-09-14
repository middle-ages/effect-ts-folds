import {Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {traverseSuspended} from '../cont.js'
import {Algebra, EffectAlgebra} from '../fold/folds.js'
import {Coalgebra, EffectCoalgebra} from '../unfold/unfolds.js'

export const hylo =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: Coalgebra<F, A, Out1, Out2, In1>,
    φ: Algebra<F, B, Out1, Out2, In1>,
  ): ((a: A) => B) => {
    const run: (a: A) => EF.Effect<B> = a => {
      return pipe(a, ψ, traverseSuspended(F)(run), EF.map(φ))
    }

    return flow(run, EF.runSync)
  }

export const hyloE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: EffectCoalgebra<F, A, E, R, Out1, Out2, In1>,
    φ: EffectAlgebra<F, B, E, R, Out1, Out2, In1>,
  ): ((a: A) => EF.Effect<B, E, R>) => {
    const run: (a: A) => EF.Effect<B, E, R> = a =>
      pipe(a, ψ, EF.flatMap(traverseSuspended(F)(run)), EF.flatMap(φ))

    return run
  }
