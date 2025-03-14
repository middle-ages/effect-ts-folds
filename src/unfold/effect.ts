import {Fix, SumTypeLambda} from '#fix'
import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

/**
 * The return type of all schemes that unfold into an effect.
 * @category unfold
 */
export type EffectUnfold<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = (a: A) => EF.Effect<Fix<F, E2, R2, I2>, E1, R1>

/**
 * Same as `Unfolder` but unfolds into an effect.
 * @category unfold
 */
export type EffectUnfolder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = (
  a: A,
) => EF.Effect<Kind<Outer, I2, R2, E2, Kind<Inner, I2, R2, E2, A>>, E1, R1>

/**
 * Unfold into an effect. A function of the type:
 * `(a: A) ⇒ Effect<F<A, E, R, I>, E, R>`
 * @category unfold
 */
export type EffectCoalgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectUnfolder<F, Id, A, E1, R1, E2, R2, I2>

/**
 * Same as {@link RCoalgebra} but unfolds into an effect. A function
 * of the type:
 * `(a: A) ⇒ Effect<F<Either<A, Fix<F, E, R, I>>, E, R, I>, E, R>`
 * @category unfold
 */
export type EffectRCoalgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectUnfolder<F, SumTypeLambda<F>, A, E1, R1, E2, R2, I2>

export type AnamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  ψ: EffectCoalgebra<F, A, E1, R1, E2, R2, I2>,
) => EffectUnfold<F, A, E1, R1, E2, R2, I2>

export type ApomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  ψ: EffectRCoalgebra<F, A, E1, R1, E2, R2, I2>,
) => EffectUnfold<F, A, E1, R1, E2, R2, I2>
