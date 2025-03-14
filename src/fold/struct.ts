/* eslint-disable @typescript-eslint/no-explicit-any */
import {Covariant as CO} from '@effect/typeclass'
import {pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Algebra} from './folds.js'

export type ReturnTypes<
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
  <S extends Record<string, Algebra<F, any>>>(struct: S) => {
    type Key = keyof S
    type Returns<E, R, I> = ReturnTypes<F, S, E, R, I>

    return <E = unknown, R = unknown, I = never>(
      fas: Kind<F, I, R, E, Returns<E, R, I>>,
    ): Returns<E, R, I> => {
      const result = {} as Returns<E, R, I>

      for (const key of Object.keys(struct) as Key[]) {
        result[key] = pipe(
          fas,
          F.map(xs => xs[key]),
          struct[key] as Algebra<F, any>,
        ) as Returns<E, R, I>[typeof key]
      }

      return result
    }
  }
