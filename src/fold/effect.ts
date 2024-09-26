import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Effect as EF} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, ProductTypeLambda} from '../fix.js'
import {DistLeft} from './folds.js'

/**
 * The return type of all schemes that fold into an effect.
 * @category fold
 */
export type EffectFold<F extends TypeLambda, A, E, R, Out1, Out2, In1> = (
  fixed: Fix<F, Out1, Out2, In1>,
) => EF.Effect<A, E, R>

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
 * Same as {@link Algebra} but folds in an effect. A function of the type:
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

/**
 * An {@link RAlgebra} that unfolds into an effect. A function of the type:
 * `(fa: F<I₁, O₂, O₁, [Fix<F, O₁, O₂, I₁>, A]>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectRAlgebra<
  F extends TypeLambda,
  A,
  E = never,
  R = never,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = EffectFolder<F, ProductTypeLambda<F>, A, E, R, Out1, Out2, In1>

export type CatamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = unknown, Out1 = unknown, Out2 = unknown, In1 = never>(
  φ: EffectAlgebra<F, A, E, R, Out1, Out2, In1>,
) => EffectFold<F, A, E, R, Out1, Out2, In1>

export type ParamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
  φ: EffectRAlgebra<F, A, E, R, Out1, Out2, In1>,
) => EffectFold<F, A, E, R, Out1, Out2, In1>

export type ZygomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
  f: DistLeft<F, A, B, Out1, Out2, In1>,
  φ: EffectAlgebra<F, B, E, R, Out1, Out2, In1>,
) => EffectFold<F, A, E, R, Out1, Out2, In1>
