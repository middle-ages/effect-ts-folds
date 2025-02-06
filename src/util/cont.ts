import {Traversable as TA} from '@effect/typeclass'
import {getApplicative} from '@effect/typeclass/data/Effect'
import {Effect as EF, pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export const traverseSuspended: typeof traverseEffect = F => f => fa =>
  EF.suspend(() => pipe(fa, traverseEffect(F)(f)))

const traverseEffect =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E1 = unknown, R1 = never>(
    f: (a: A) => EF.Effect<B, E1, R1>,
  ): (<E2 = unknown, R2 = never>(
    fa: Kind<F, R2, unknown, E2, A>,
  ) => EF.Effect<Kind<F, R2, unknown, E2, B>, E1, R1>) =>
    F.traverse(getApplicative())(f)
