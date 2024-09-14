import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {SumTypeLambda} from '../fix.js'

/**
 * A function of type:
 * `(a: A) ⇒ Outer<I₁, O₂, O₁, Inner<I₁, O₂, O₁, A>>`.
 * @category unfold
 */
export type Unfold<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  Out1,
  Out2,
  In1,
> = (a: A) => Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>

/**
 * Same as `Unfold` but unfolds into an effect.
 * @category unfold
 */
export type EffectUnfold<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E,
  R,
  Out1,
  Out2,
  In1,
> = (
  a: A,
) => EF.Effect<
  Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>,
  E,
  R
>

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
> = Unfold<F, Id, A, Out1, Out2, In1>

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
> = Unfold<F, SumTypeLambda<F>, A, Out1, Out2, In1>

/**
 * Unfold into an effect. A function of the type:
 * `(a: A) ⇒ Effect<F<I₁, O₂, O₁, A>, E, R>`
 * @category unfold
 */
export type EffectCoalgebra<
  F extends TypeLambda,
  A,
  E = never,
  R = never,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = EffectUnfold<F, Id, A, E, R, Out1, Out2, In1>
