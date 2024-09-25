import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, ProductTypeLambda} from '../fix.js'

/**
 * The return type of all folding schemes.
 * @category fold
 */
export type Fold<
  F extends TypeLambda,
  A,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = (fixed: Fix<F, Out1, Out2, In1>) => A

/**
 * The return type of all schemes that fold into an effect.
 * @category fold
 */
export type EffectFold<F extends TypeLambda, A, E, R, Out1, Out2, In1> = (
  fixed: Fix<F, Out1, Out2, In1>,
) => EF.Effect<A, E, R>

/**
 * A function of type:
 * `(fa: Outer<I₁, O₂, O₁, Inner<I₁, O₂, O₁, A>>) ⇒ A`.
 * @category fold
 */
export type Folder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  Out1,
  Out2,
  In1,
> = (fa: Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>) => A

/**
 * Same as `Folder` but folds into an `Effect`.
 * @category fold
 */
export type EffectFolder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E,
  R,
  Out1,
  Out2,
  In1,
> = (
  fa: Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>,
) => EF.Effect<A, E, R>

/**
 * A function of the type: `(fa: F<I₁, O₂, O₁, A>) ⇒ A`.
 * @category fold
 */
export type Algebra<
  F extends TypeLambda,
  A,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Folder<F, Id, A, Out1, Out2, In1>

/**
 * Same as `Algebra` except the `A` type on the left hand side is replaced with
 * a tuple of `Fix<F>` and `A`. A function of the type:
 * `(fa: F<I₁, O₂, O₁, [Fix<F, O₁, O₂, I₁>, A]>) ⇒ A`
 * @category fold
 */
export type RAlgebra<
  F extends TypeLambda,
  A,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Folder<F, ProductTypeLambda<F>, A, Out1, Out2, In1>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `A` and `B`. A function of the type:
 * `(fa: F<I₁, O₂, O₁, [A, B]>) ⇒ A`
 * @category fold
 */
export type DistLeft<
  F extends TypeLambda,
  A,
  B,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Folder<F, TupleWithTypeLambda<B>, A, Out1, Out2, In1>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `B` and `A`. A function of the type:
 * `(fa: F<I₁, O₂, O₁, [B, A]>) ⇒ A`
 * @category fold
 */
export type DistRight<
  F extends TypeLambda,
  A,
  B,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = (fa: Kind<F, In1, Out2, Out1, [B, A]>) => A

/**
 * Same as `Algebra` but folds in an effect. A function of the type:
 * `(fa: F<I₁, O₂, O₁, A>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectAlgebra<
  F extends TypeLambda,
  A,
  E = never,
  R = never,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = EffectFolder<F, Id, A, E, R, Out1, Out2, In1>

export interface AlgebraTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: Algebra<
    F,
    this['Target'],
    this['Out1'],
    this['Out2'],
    this['In']
  >
}

export interface TupleWithTypeLambda<B> extends TypeLambda {
  readonly type: [this['Target'], B]
}
