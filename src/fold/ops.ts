import {Covariant as CO, Invariant as IN} from '@effect/typeclass'
import {dual, pipe} from 'effect/Function'
import {TypeLambda} from 'effect/HKT'
import {Algebra, AlgebraTypeLambda} from './folds.js'

/**
 * `Algebra` is invariant in the `A` type.
 * @category fold
 */
export const imap = <F extends TypeLambda>(
  F: CO.Covariant<F>,
): IN.Invariant<AlgebraTypeLambda<F>>['imap'] =>
  dual(
    3,
    <In1, Out2, Out1, A, B>(
      self: Algebra<F, A, Out1, Out2, In1>,
      to: (a: A) => B,
      from: (b: B) => A,
    ): Algebra<F, B, Out1, Out2, In1> =>
      fa =>
        pipe(fa, F.map(from), self, to),
  )
