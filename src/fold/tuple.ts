import {Covariant as CO} from '@effect/typeclass'
import {Array as AR, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {fanout} from '../util.js'
import {Algebra} from './folds.js'

/**
 * Convert a tuple of algebras into an algebra of a tuple.
 * @category ops
 */
export const zipFolds =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <const Targets extends AR.NonEmptyArray<unknown>, E = unknown, R = never>(
    ...[head, ...tail]: TupledAlgebras<F, Targets, E, R>
  ) =>
    pipe(
      tail,
      AR.reduce(
        unaryTuple(F)(head),
        (previous, current) => appendFold(F)(previous, current) as never,
      ),
    ) as unknown as Algebra<F, Targets, E, R>

/**
 * Append an algebra to an algebra of a tuple.
 * @category ops
 */
export const appendFold =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <const Targets extends AR.NonEmptyArray<unknown>, A, E = unknown, R = never>(
    algebra: Algebra<F, Targets, E, R>,
    append: Algebra<F, A, E, R>,
  ): Algebra<F, [...Targets, A], E, R> =>
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
  <A, E = unknown, R = never>(
    fold: Algebra<F, A, E, R>,
  ): Algebra<F, [A], E, R> =>
  fa => [pipe(fa, F.map(AR.headNonEmpty), fold)]

/**
 * The type of a tuple of algebras with the given `Targets`.
 * @category ops
 */
export type TupledAlgebras<
  F extends TypeLambda,
  Targets extends [unknown, ...unknown[]],
  R = never,
  E = unknown,
> = {
  [K in keyof Targets]: Algebra<F, Targets[K], E, R>
}
