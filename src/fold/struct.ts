/* eslint-disable @typescript-eslint/no-explicit-any */
import {Covariant as CO} from '@effect/typeclass'
import {pipe, Types} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Algebra} from './folds.js'

export type StructReturns<
  F extends TypeLambda,
  S extends Record<string, Algebra<F, any>>,
  E = unknown,
  R = unknown,
  I = never,
> = {
  [K in keyof S]: S[K] extends Algebra<F, infer A, E, R, I> ? A : never
}

/**
 * Convert a struct of algebras into an algebra of a struct.
 * @category ops
 */
export const struct =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <const S extends Record<string, Algebra<F, any>>>(struct: S) => {
    type Key = keyof S

    return <E = unknown, R = unknown, I = never>(
      fas: Kind<F, I, R, E, StructReturns<F, S, E, R, I>>,
    ): Types.Simplify<StructReturns<F, S, E, R, I>> => {
      const result = {} as StructReturns<F, S, E, R, I>

      for (const key of Object.keys(struct) as Key[]) {
        result[key] = pipe(
          fas,
          F.map(xs => xs[key]),
          struct[key] as Algebra<F, any>,
        ) as StructReturns<F, S, E, R, I>[typeof key]
      }

      return result as Types.Simplify<StructReturns<F, S, E, R, I>>
    }
  }
