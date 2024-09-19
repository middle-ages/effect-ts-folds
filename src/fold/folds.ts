import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {ProductTypeLambda} from '../fix.js'

/**
 * A function of type:
 * `(fa: Outer<I₁, O₂, O₁, Inner<I₁, O₂, O₁, A>>) ⇒ A`.
 * @category fold
 */
export type Fold<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  Out1,
  Out2,
  In1,
> = (fa: Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>) => A

/**
 * Same as `Fold` but folds into an `Effect`.
 * @category fold
 */
export type EffectFold<
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
> = Fold<F, Id, A, Out1, Out2, In1>

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
> = Fold<F, ProductTypeLambda<F>, A, Out1, Out2, In1>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `A` and `B`. A function of the type:
 * `(fa: F<I₁, O₂, O₁, [A, B]>) ⇒ A`
 * @category fold
 */
export type ZDist<
  F extends TypeLambda,
  A,
  B,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Fold<F, TupleWithTypeLambda<B>, A, Out1, Out2, In1>

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
> = EffectFold<F, Id, A, E, R, Out1, Out2, In1>

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
