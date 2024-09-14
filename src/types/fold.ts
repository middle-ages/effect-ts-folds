import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {ProductTypeLambda} from '../fix.js'

/**
 * The generalized algebra is a function of type:
 * `(fa: Outer<I₁, O₂, O₁, Inner<I₁, O₂, O₁, A>>) ⇒ A`.
 * @category fold
 */
export interface GAlgebra<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  In1,
  Out2,
  Out1,
  A,
> {
  (fa: Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>): A
}

/**
 * A function of the type: `(fa: F<I₁, O₂, O₁, A>) ⇒ A`.
 * @category fold
 */
export type Algebra<F extends TypeLambda, In1, Out2, Out1, A> = GAlgebra<
  F,
  Id,
  In1,
  Out2,
  Out1,
  A
>

/**
 * Same as `Algebra` except the `A` type is replaced with a tuple of
 * `Fix<F, E>` and `A`. A function of the type:
 * `(fa: F<I₁, O₂, O₁, [Fix<F, I₁, O₂, O₁>, A]>) ⇒ A`
 * @category fold
 */
export type RAlgebra<F extends TypeLambda, In1, Out2, Out1, A> = GAlgebra<
  F,
  ProductTypeLambda<F>,
  In1,
  Out2,
  Out1,
  A
>

/**
 * Same as `Algebra` but folds in an effect. A function of the type:
 * `(fa: F<never, R, E, A>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectAlgebra<F extends TypeLambda, R, E, A, In1, Out2, Out1> = (
  fa: Kind<F, In1, Out2, Out1, A>,
) => EF.Effect<A, E, R>
