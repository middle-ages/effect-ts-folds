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
export type EffectFold<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = never,
> = (fixed: Fix<F, E2, R2>) => EF.Effect<A, E1, R1>

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
  R2 = never,
> = (
  fa: Kind<Outer, R2, unknown, E2, Kind<Inner, R2, unknown, E2, A>>,
) => EF.Effect<A, E1, R1>

/**
 * Same as {@link Algebra} but folds in an effect. A function of the type:
 * `(fa: F<A, E, R>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectAlgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = never,
> = EffectFolder<F, Id, A, E1, R1, E2, R2>

/**
 * An {@link RAlgebra} that unfolds into an effect. A function of the type:
 * `(fa: F<[Fix<F, E, R>, A], E, R>) ⇒ Effect<A, E, R>`
 * @category fold
 */
export type EffectRAlgebra<
  F extends TypeLambda,
  A,
  E1 = unknown,
  R1 = never,
  E2 = unknown,
  R2 = never,
> = EffectFolder<F, ProductTypeLambda<F>, A, E1, R1, E2, R2>

export type CatamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = never>(
  φ: EffectAlgebra<F, A, E1, R1, E2, R2>,
) => EffectFold<F, A, E1, R1, E2, R2>

export type ParamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E1 = unknown, R1 = never, E2 = unknown, R2 = never>(
  φ: EffectRAlgebra<F, A, E1, R1, E2, R2>,
) => EffectFold<F, A, E1, R1, E2, R2>

export type ZygomorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E1 = unknown, R1 = never, E2 = unknown, R2 = never>(
  f: DistLeft<F, A, B, E2, R2>,
  φ: EffectAlgebra<F, B, E1, R1, E2, R2>,
) => EffectFold<F, A, E1, R1, E2, R2>
