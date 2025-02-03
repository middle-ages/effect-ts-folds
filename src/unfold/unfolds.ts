import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, SumTypeLambda} from '../fix.js'

/**
 * The return type of all unfolding schemes. A function of the type:
 * `(a: A) ⇒ F<R, E>`
 * @category unfold
 */
export type Unfold<F extends TypeLambda, A, E = unknown, R = never> = (
  a: A,
) => Fix<F, E, R>

/**
 * A function of type:
 * `(a: A) ⇒ Outer<Inner<A, E, R>, E, R>`.
 * @category unfold
 */
export type Unfolder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E = unknown,
  R = never,
> = (a: A) => Kind<Outer, R, unknown, E, Kind<Inner, R, unknown, E, A>>

/**
 * A function of the type: `(a: A) ⇒ F<A, E, R>`.
 * @category unfold
 */
export type Coalgebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = never,
> = Unfolder<F, Id, A, E, R>

/**
 * A function of the type:
 * `(a: A) ⇒ F<Either<A, Fix<F, E, R>>, E, R>`
 * @category unfold
 */
export type RCoalgebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = never,
> = Unfolder<F, SumTypeLambda<F>, A, E, R>

export type Anamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = never>(ψ: Coalgebra<F, A, E, R>) => Unfold<F, A, E, R>

export type Apomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = never>(
  ψ: RCoalgebra<F, A, E, R>,
) => Unfold<F, A, E, R>
