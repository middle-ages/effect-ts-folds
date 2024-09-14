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
    type ReturnTypes<Out2, Out1, In1> = {
      [K in Key]: S[K] extends Algebra<F, infer A, Out2, Out1, In1> ? A : never
    }

    return <Out1 = unknown, Out2 = unknown, In1 = never>(
      fas: Kind<F, In1, Out2, Out1, ReturnTypes<Out2, Out1, In1>>,
    ) => {
      const result = {} as ReturnTypes<Out2, Out1, In1>

      for (const key of Object.keys(struct) as Key[])
        result[key] = pipe(
          fas,
          F.map(xs => xs[key]),
          struct[key] as Algebra<F, any>,
        ) as ReturnTypes<Out2, Out1, In1>[typeof key]

      return result
    }
  }
