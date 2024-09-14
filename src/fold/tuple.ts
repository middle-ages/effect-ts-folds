import {Covariant as CO} from '@effect/typeclass'
import {Array as AR, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {fanout} from '../pair.js'
import {Algebra} from './folds.js'

/**
 * Convert a tuple of algebras into an algebra of a tuple.
 * @category ops
 */
export const zipFolds =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <
    const Targets extends AR.NonEmptyArray<unknown>,
    Out1 = unknown,
    Out2 = unknown,
    In1 = never,
  >(
    ...[head, ...tail]: TupledAlgebras<F, Targets, Out1, Out2, In1>
  ) =>
    pipe(
      tail,
      AR.reduce(
        unaryTuple(F)(head),
        (previous, current) => appendFold(F)(previous, current) as never,
      ),
    ) as unknown as Algebra<F, Targets, Out1, Out2, In1>

/**
 * Append an algebra to an algebra of a tuple.
 * @category ops
 */
export const appendFold =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <
    const Targets extends AR.NonEmptyArray<unknown>,
    A,
    Out1 = unknown,
    Out2 = unknown,
    In1 = never,
  >(
    algebra: Algebra<F, Targets, Out1, Out2, In1>,
    append: Algebra<F, A, Out1, Out2, In1>,
  ): Algebra<F, [...Targets, A], Out1, Out2, In1> =>
  f =>
    pipe(
      f,
      fanout(
        F.map(xs => AR.initNonEmpty(xs) as Targets),
        F.map(xs => AR.lastNonEmpty(xs as AR.NonEmptyArray<A>)),
      ),
      ([algebraArg, appendArg]) => [...algebra(algebraArg), append(appendArg)],
    )

/**
 * Convert an algebra of `A` into an algebra of `[A]`.
 * @category ops
 */
export const unaryTuple =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    fold: Algebra<F, A, Out1, Out2, In1>,
  ): Algebra<F, [A], Out1, Out2, In1> =>
  fa => [pipe(fa, F.map(AR.headNonEmpty), fold)]

/**
 * The type of a tuple of algebras with the given `Targets`.
 * @category ops
 */
export type TupledAlgebras<
  F extends TypeLambda,
  Targets extends [unknown, ...unknown[]],
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = {
  [K in keyof Targets]: Algebra<F, Targets[K], Out1, Out2, In1>
}
