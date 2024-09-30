import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, SumTypeLambda} from '../fix.js'

/**
 * The return type of all unfolding schemes.
 * @category unfold
 */
export type Unfold<
  F extends TypeLambda,
  A,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = (a: A) => Fix<F, Out1, Out2, In1>

/**
 * A function of type:
 * `(a: A) ⇒ Outer<I₁, O₂, O₁, Inner<I₁, O₂, O₁, A>>`.
 * @category unfold
 */
export type Unfolder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  Out1,
  Out2,
  In1,
> = (a: A) => Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>

/**
 * A function of the type: `(a: A) ⇒ F<I₁, O₂, O₁, A>`.
 * @category unfold
 */
export type Coalgebra<
  F extends TypeLambda,
  A,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Unfolder<F, Id, A, Out1, Out2, In1>

/**
 * A function of the type:
 * `(a: A) ⇒ F<I₁, O₂, O₁, Either<A, Fix<F, O₁, O₂, I₁>>>`
 * @category unfold
 */
export type RCoalgebra<
  F extends TypeLambda,
  A,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Unfolder<F, SumTypeLambda<F>, A, Out1, Out2, In1>

export type Anamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: Coalgebra<F, A, Out1, Out2, In1>,
) => Unfold<F, A, Out1, Out2, In1>

export type Apomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: RCoalgebra<F, A, Out1, Out2, In1>,
) => Unfold<F, A, Out1, Out2, In1>
