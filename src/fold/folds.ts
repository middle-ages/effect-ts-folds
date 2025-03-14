import {CofreeTypeLambda, Fix, ProductTypeLambda} from '#fix'
import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {Kind, TypeLambda} from 'effect/HKT'

/*
 * A function of type: `(fa: Outer<Inner<A, E, R, I>, E, R, I>) ⇒ A`.
 * @category fold
 */
export interface Folder<
  Outer extends TypeLambda,
  Inner extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> {
  (fa: Kind<Outer, I, R, E, Kind<Inner, I, R, E, A>>): A
}

/**
 * A function of the type: `(fa: F<A, E, R, I>) ⇒ A`.
 * @category fold
 */
export type Algebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = Folder<F, Id, A, E, R, I>

/**
 * Same as `Algebra` except the `A` type on the left hand side is replaced with
 * a tuple of `Fix<F>` and `A`. A function of the type:
 * `(fa: F<[Fix<F, E, R, I>, A], E, R, I>) ⇒ A`.
 * @category fold
 */
export type RAlgebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = Folder<F, ProductTypeLambda<F>, A, E, R, I>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `A` and `B`. A function of the type:
 * `(fa: F<[A, B], E, R, I>) ⇒ A`.
 * @category fold
 */
export type DistLeft<
  F extends TypeLambda,
  A,
  B,
  E = unknown,
  R = unknown,
  I = never,
> = Folder<F, TupleWithTypeLambda<B>, A, E, R, I>

/**
 * Same as `Algebra` except the `A` type on the left side is replaced with a
 * tuple of `B` and `A`. A function of the type:
 * `(fa: F<[B, A], E, R, I>) ⇒ A`.
 * @category fold
 */
export interface DistRight<
  F extends TypeLambda,
  A,
  B,
  E = unknown,
  R = unknown,
  I = never,
> {
  (fa: Kind<F, I, R, E, [B, A]>): A
}

/**
 * Same as `Algebra` except the `Fix` type on the left side is replaced with a
 * `Cofree`. A function of the type: `(fa: F<Cofree<F, A, E, R, I>, E, R, I>) ⇒
 * A`.
 * @category fold
 */
export type CVAlgebra<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = Folder<F, CofreeTypeLambda<F>, A, E, R, I>

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

/**
 * The return type for cata, para, and zygo.
 * @category fold
 */
export interface Fold<
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> {
  (fixed: Fix<F, E, R, I>): A
}

export interface Catamorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <A, E = unknown, R = unknown, I = never>(
    φ: Algebra<F, A, E, R, I>,
  ) => Fold<F, A, E, R, I>
}

export interface Paramorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <A, E = unknown, R = unknown, I = never>(
    φ: RAlgebra<F, A, E, R, I>,
  ) => Fold<F, A, E, R, I>
}

export interface Zygomorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <A, B, E = unknown, R = unknown, I = never>(
    f: DistLeft<F, A, B, E, R, I>,
    φ: Algebra<F, B, E, R, I>,
  ) => Fold<F, A, E, R, I>
}

export interface Histomorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <A, E = unknown, R = unknown, I = never>(
    φ: CVAlgebra<F, A, E, R, I>,
  ) => Fold<F, A, E, R, I>
}
