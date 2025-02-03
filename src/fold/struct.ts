import {Covariant as CO} from '@effect/typeclass'
import {pipe} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Algebra} from './folds.js'

/**
 * Convert a struct of algebras into an algebra of a struct.
 * @category ops
 */
export const struct =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <S extends Record<string, Algebra<F, any>>>(struct: S) => {
    type Key = keyof S
    type ReturnTypes<R, E> = {
      [K in Key]: S[K] extends Algebra<F, infer A, R, E> ? A : never
    }

    return <R = never, E = unknown>(
      fas: Kind<F, R, unknown, E, ReturnTypes<R, E>>,
    ): ReturnTypes<R, E> => {
      const result = {} as ReturnTypes<R, E>

      for (const key of Object.keys(struct) as Key[])
        result[key] = pipe(
          fas,
          F.map(xs => xs[key]),
          struct[key] as Algebra<F, any>,
        ) as ReturnTypes<R, E>[typeof key]

      return result
    }
  }
