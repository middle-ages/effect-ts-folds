import {Traversable as TA} from '@effect/typeclass'
import {getApplicative} from '@effect/typeclass/data/Effect'
import {Effect, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export const traverseSuspended: typeof traverseEffect = F => f => fa =>
  Effect.suspend(() => pipe(fa, traverseEffect(F)(f)))

export const traverseEffect =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E1 = unknown, R1 = unknown>(
    f: (a: A) => Effect.Effect<B, E1, R1>,
  ): (<E2 = unknown, R2 = unknown, I2 = never>(
    fa: Kind<F, I2, R2, E2, A>,
  ) => Effect.Effect<Kind<F, I2, R2, E2, B>, E1, R1>) =>
    F.traverse(getApplicative())(f)

export const succeedBy =
  <A, B>(f: (a: A) => B) =>
  (a: A): Effect.Effect<B> =>
    pipe(a, f, Effect.succeed)
