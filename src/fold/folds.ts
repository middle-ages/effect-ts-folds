import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, ProductTypeLambda} from '../fix.js'

/**
 * The return type of all folding schemes.
 * @category fold
 */
export type Fold<F extends TypeLambda, A, E = unknown, R = never> = (
  fixed: Fix<F, E, R>,
) => A

/*
 * A function of type: `(fa: Outer<Inner<A, E, R>, E, R>) ⇒ A`.
 * @category fold
 */
export type Folder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E = unknown,
  R = never,
> = (fa: Kind<Outer, R, unknown, E, Kind<Inner, R, unknown, E, A>>) => A

/**
 * A function of the type: `(fa: F<A, E, R>) ⇒ A`.
 * @category fold
 */
export type Algebra<F extends TypeLambda, A, E = unknown, R = never> = Folder<
  F,
  Id,
  A,
  E,
  R
>

/**
 * Same as `Algebra` except the `A` type on the left hand side is replaced with
 * a tuple of `Fix<F>` and `A`. A function of the type:
 * `(fa: F<[Fix<F, E, R>, A], E, R>) ⇒ A`
 * @category fold
 */
export type RAlgebra<F extends TypeLambda, A, E = unknown, R = never> = Folder<
  F,
  ProductTypeLambda<F>,
  A,
  E,
  R
>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `A` and `B`. A function of the type:
 * `(fa: F<[A, B], E, R>) ⇒ A`
 * @category fold
 */
export type DistLeft<
  F extends TypeLambda,
  A,
  B,
  E = unknown,
  R = never,
> = Folder<F, TupleWithTypeLambda<B>, A, E, R>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `B` and `A`. A function of the type:
 * `(fa: F<[B, A], E, R>) ⇒ A`
 * @category fold
 */
export type DistRight<F extends TypeLambda, A, B, E = unknown, R = never> = (
  fa: Kind<F, R, unknown, E, [B, A]>,
) => A

export interface AlgebraTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: Algebra<F, this['Target'], this['Out1'], this['In']>
}

export interface TupleWithTypeLambda<B> extends TypeLambda {
  readonly type: [this['Target'], B]
}

export type Catamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = never>(φ: Algebra<F, A, E, R>) => Fold<F, A, E, R>

export type Paramorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = unknown, R = never>(φ: RAlgebra<F, A, E, R>) => Fold<F, A, E, R>

export type Zygomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, B, E = unknown, R = never>(
  f: DistLeft<F, A, B, E, R>,
  φ: Algebra<F, B, E, R>,
) => Fold<F, A, E, R>
