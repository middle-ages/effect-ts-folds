import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Applicative as IdentityApplicative} from '@effect/typeclass/data/Identity'
import {pipe} from 'effect'
import {dual} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'

const map = <F extends TypeLambda>(
  F: TA.Traversable<F>,
): CO.Covariant<F>['map'] =>
  dual(
    2,
    <A, B, E = unknown, R = never>(
      fa: Kind<F, R, unknown, E, A>,
      f: (a: A) => B,
    ) => pipe(fa, F.traverse(IdentityApplicative)(f)),
  )

/** Convert a traversable instance to a covariant one. */
export const traverseCovariant = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => ({map: map(F), imap: CO.imap(map(F))})
