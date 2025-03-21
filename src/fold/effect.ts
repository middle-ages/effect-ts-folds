import {CofreeTypeLambda, Fix, ProductTypeLambda} from '#fix'
import {Traversable as TA, Traversable} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect, HKT} from 'effect'
import {DistLeft} from './folds.js'

//export interface ComposeTypeLambda<F extends TypeLambda, G extends TypeLambda, R1 = unknown, O1 = never, E1 = never, R2 = R1, O2 = O1, E2 = E1> extends TypeLambda {
/**
 * Same as `Folder` but folds into an `Effect`.
 * @category fold
 */
export type EffectFolder<
  Outer extends HKT.TypeLambda,
  Inner extends HKT.TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = (
  fa: HKT.Kind<Outer, I2, R2, E2, HKT.Kind<Inner, I2, R2, E2, A>>,
) => Effect.Effect<A, E1, R1>

/**
 * Same as {@link Algebra} but folds in an effect. A function of the type:
 * `(fa: F<A, E2, R2, I2>) ⇒ Effect<A, E1, R1>`.
 * @category fold
 */
export type EffectAlgebra<
  F extends HKT.TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectFolder<F, Id, A, E1, R1, E2, R2, I2>

/**
 * An {@link RAlgebra} that folds into an effect. A function of the type:
 * `(fa: F<[Fix<F, E2, R2, I2>, A], E2, R2, I2>) ⇒ Effect<A, E1, R1>`.
 * @category fold
 */
export type EffectRAlgebra<
  F extends HKT.TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = EffectFolder<F, ProductTypeLambda<F>, A, E1, R1, E2, R2, I2>

/**
 * A {@link CVAlgebra} that folds into an effect. A function of the type:
 * `(fa: F<Cofree<F, A, E2, R2, I2>, E2, R2, I2>) ⇒ Effect<A, E1, R1>`.
 * @category fold
 */
export type EffectCVAlgebra<
  F extends HKT.TypeLambda,
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
  F extends HKT.TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = (fixed: Fix<F, E2, R2, I2>) => Effect.Effect<A, E1, R1>

/**
 * Type of effectful folds with a single carrier type `A`.
 * @category folds
 */
export interface UnaryEffectFold<
  T extends HKT.TypeLambda,
  F extends HKT.TypeLambda,
> {
  <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
    φ: EffectFolder<F, T, A, E1, R1, E2, R2, I2>,
  ): EffectFold<F, A, E1, R1, E2, R2, I2>
}

export interface CatamorphismE {
  <F extends HKT.TypeLambda>(
    F: Traversable.Traversable<F>,
  ): UnaryEffectFold<Id, F>
}

export interface ParamorphismE {
  <F extends HKT.TypeLambda>(
    F: Traversable.Traversable<F>,
  ): UnaryEffectFold<ProductTypeLambda<F>, F>
}

export interface HistomorphismE {
  <F extends HKT.TypeLambda>(
    F: Traversable.Traversable<F>,
  ): UnaryEffectFold<CofreeTypeLambda<F>, F>
}

export type ZygomorphismE = <F extends HKT.TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
  f: DistLeft<F, A, B, E2, R2, I2>,
  φ: EffectAlgebra<F, B, E1, R1, E2, R2, I2>,
) => EffectFold<F, A, E1, R1, E2, R2, I2>
