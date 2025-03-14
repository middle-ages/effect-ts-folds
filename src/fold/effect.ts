import {CofreeTypeLambda, Fix, ProductTypeLambda} from '#fix'
import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {DistLeft} from './folds.js'

/**
 * Same as `Folder` but folds into an `Effect`.
 * @category fold
 */
export type EffectFolder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = (
  fa: Kind<Outer, I2, R2, E2, Kind<Inner, I2, R2, E2, A>>,
) => EF.Effect<A, E1, R1>

/**
 * Same as {@link Algebra} but folds in an effect. A function of the type:
 * `(fa: F<A, E, R, I>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectAlgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectFolder<F, Id, A, E1, R1, E2, R2, I2>

/**
 * An {@link RAlgebra} that folds into an effect. A function of the type:
 * `(fa: F<[Fix<F, E, R, I>, A], E, R, I>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectRAlgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectFolder<F, ProductTypeLambda<F>, A, E1, R1, E2, R2, I2>

/**
 * A {@link CVAlgebra} that folds into an effect. A function of the type:
 * `(fa: F<Cofree<F, A, E, R, I>, E, R, I>) ⇒ Effect<A, E, R>`.
 * @category fold
 */
export type EffectCVAlgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectFolder<F, CofreeTypeLambda<F>, A, E1, R1, E2, R2, I2>

/**
 * The return type of all schemes that fold into an effect.
 * @category fold
 */
export type EffectFold<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = (fixed: Fix<F, E2, R2, I2>) => EF.Effect<A, E1, R1>

export type CatamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  φ: EffectAlgebra<F, A, E1, R1, E2, R2, I2>,
) => EffectFold<F, A, E1, R1, E2, R2, I2>

export type ParamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  φ: EffectRAlgebra<F, A, E1, R1, E2, R2, I2>,
) => EffectFold<F, A, E1, R1, E2, R2, I2>

export type ZygomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  f: DistLeft<F, A, B, E2, R2, I2>,
  φ: EffectAlgebra<F, B, E1, R1, E2, R2, I2>,
) => EffectFold<F, A, E1, R1, E2, R2, I2>

export type HistomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  φ: EffectCVAlgebra<F, A, E1, R1, E2, R2, I2>,
) => EffectFold<F, A, E1, R1, E2, R2, I2>
