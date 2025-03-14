import {Fix, SumTypeLambda} from '#fix'
import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Kind, TypeLambda} from 'effect/HKT'

/**
 * A function of type:
 * `(a: A) ⇒ Outer<Inner<A, E, R, I>, E, R, I>`.
 * @category unfold
 */
export interface Unfolder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> {
  (a: A): Kind<Outer, I, R, E, Kind<Inner, I, R, E, A>>
}

/**
 * The return type of all unfolding schemes. A function of the type:
 * `(a: A) ⇒ F<E, R, I>`.
 * @category unfold
 */
export interface Unfold<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> {
  (a: A): Fix<F, E, R, I>
}

/**
 * A function of the type: `(a: A) ⇒ F<A, E, R, I>`.
 * @category unfold
 */
export type Coalgebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = Unfolder<F, Id, A, E, R, I>

/**
 * A function of the type:
 * `(a: A) ⇒ F<Either<A, Fix<F, E, R, I>>, E, R, I>`.
 * @category unfold
 */
export type RCoalgebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = Unfolder<F, SumTypeLambda<F>, A, E, R, I>

export type Anamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = unknown, I = never>(
  ψ: Coalgebra<F, A, E, R, I>,
) => Unfold<F, A, E, R, I>

export type Apomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = unknown, I = never>(
  ψ: RCoalgebra<F, A, E, R, I>,
) => Unfold<F, A, E, R, I>
