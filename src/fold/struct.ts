/* eslint-disable @typescript-eslint/no-explicit-any */
import {Covariant as CO} from '@effect/typeclass'
import {pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Algebra} from './folds.js'

export type ReturnTypes<
  F extends TypeLambda,
  S extends Record<string, Algebra<F, any>>,
  R = never,
  E = unknown,
> = {
  [K in keyof S]: S[K] extends Algebra<F, infer A, R, E> ? A : never
}

/**
 * Convert a struct of algebras into an algebra of a struct.
 * @category ops
 */
export const struct =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <S extends Record<string, Algebra<F, any>>>(struct: S) => {
    type Key = keyof S
    type Returns<R, E> = ReturnTypes<F, S, R, E>

    return <R = never, E = unknown>(
      fas: Kind<F, R, unknown, E, Returns<R, E>>,
    ): Returns<R, E> => {
      const result = {} as Returns<R, E>

      for (const key of Object.keys(struct) as Key[])
        result[key] = pipe(
          fas,
          F.map(xs => xs[key]),
          struct[key] as Algebra<F, any>,
        ) as Returns<R, E>[typeof key]

      return result
    }
  }
