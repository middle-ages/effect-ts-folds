import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, SumTypeLambda} from '../fix.js'

/**
 * The return type of all schemes that unfold into an effect.
 * @category unfold
 */
export type EffectUnfold<F extends TypeLambda, A, E, R, Out1, Out2, In1> = (
  a: A,
) => EF.Effect<Fix<F, Out1, Out2, In1>, E, R>

/**
 * Same as `Unfolder` but unfolds into an effect.
 * @category unfold
 */
export type EffectUnfolder<
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
> = EffectUnfolder<F, Id, A, E, R, Out1, Out2, In1>

/**
 * Same as {@link RCoalgebra} but unfolds into an effect. A function
 * of the type:
 * `(a: A) ⇒ Effect<F<I₁, O₂, O₁, Either<A, Fix<F, O₁, O₂, I₁>>>, E, R>`
 * @category unfold
 */
export type EffectRCoalgebra<
  F extends TypeLambda,
  A,
  E = never,
  R = never,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = EffectUnfolder<F, SumTypeLambda<F>, A, E, R, Out1, Out2, In1>

export type AnamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: EffectCoalgebra<F, A, E, R, Out1, Out2, In1>,
) => EffectUnfold<F, A, E, R, Out1, Out2, In1>

export type ApomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: EffectRCoalgebra<F, A, E, R, Out1, Out2, In1>,
) => EffectUnfold<F, A, E, R, Out1, Out2, In1>
