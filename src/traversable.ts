import {Traversable as TA} from '@effect/typeclass'
import {Applicative as IdApplicative} from '@effect/typeclass/data/Identity'
import {pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export const traverseMap =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B>(f: (a: A) => B) =>
  <Out1 = unknown, Out2 = unknown, In1 = never>(
    fa: Kind<F, In1, Out2, Out1, A>,
  ): Kind<F, In1, Out2, Out1, B> =>
    pipe(fa, F.traverse(IdApplicative)(f))
