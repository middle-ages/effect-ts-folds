import {Traversable as TA} from '@effect/typeclass'
import {getApplicative} from '@effect/typeclass/data/Effect'
import {Effect as EF, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export const traverseEffect =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E = never, R = never>(
    f: (a: A) => EF.Effect<B, E, R>,
  ): (<Out1 = unknown, Out2 = unknown, In1 = never>(
    fa: Kind<F, In1, Out2, Out1, A>,
  ) => EF.Effect<Kind<F, In1, Out2, Out1, B>, E, R>) =>
    F.traverse(getApplicative())(f)

export const traverseSuspended: typeof traverseEffect = F => f => fa =>
  EF.suspend(() => pipe(fa, traverseEffect(F)(f)))
