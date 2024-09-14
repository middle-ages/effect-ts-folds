import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {SumTypeLambda} from '../fix.js'

/**
 * The generalized coalgebra is a function of type:
 * `(a: A) ⇒ Outer<I₁, O₂, O₁, Inner<I₁, O₂, O₁, A>>`.
 * @category unfold
 */
interface GCoalgebra<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  In1,
  Out2,
  Out1,
  A,
> {
  (a: A): Kind<Outer, In1, Out2, Out1, Kind<Inner, In1, Out2, Out1, A>>
}

/**
 * A function of the type: `(a: A) ⇒ F<I₁, O₂, O₁, A>`.
 * @category unfold
 */
export type Coalgebra<F extends TypeLambda, In1, Out2, Out1, A> = GCoalgebra<
  F,
  Id,
  In1,
  Out2,
  Out1,
  A
>

/**
 * A function of the type:
 * `(a: A) ⇒ F<I₁, O₂, O₁, Either<A, Fix<F, I₁, O₂, O₁>>>`
 * @category unfold
 */
export type RCoalgebra<F extends TypeLambda, In1, Out2, Out1, A> = GCoalgebra<
  F,
  SumTypeLambda<F>,
  In1,
  Out2,
  Out1,
  A
>

/**
 * Unfold into an effect. A function of the type:
 * `(a: A) ⇒ Effect<F<never, R, E, A>, E, R>`
 * @category unfold
 */
export type EffectCoalgebra<F extends TypeLambda, R, E, A, In1, Out2, Out1> = (
  a: A,
) => EF.Effect<Kind<F, In1, Out2, Out1, A>, E, R>
