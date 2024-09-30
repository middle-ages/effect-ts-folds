import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Applicative as IdApplicative} from '@effect/typeclass/data/Identity'
import {pipe} from 'effect'
import {dual} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'

export const traverseMap = <F extends TypeLambda>(
  F: TA.Traversable<F>,
): CO.Covariant<F>['map'] =>
  dual(
    2,
    <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
      fa: Kind<F, In1, Out2, Out1, A>,
      f: (a: A) => B,
    ) => pipe(fa, F.traverse(IdApplicative)(f)),
  )

export const traverseCovariant = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => ({map: traverseMap(F), imap: CO.imap(traverseMap(F))})
