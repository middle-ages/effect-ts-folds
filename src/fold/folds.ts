import {CofreeTypeLambda, Fix, ProductTypeLambda} from '#fix'
import {Traversable as TA} from '@effect/typeclass'
import {IdentityTypeLambda as Id} from '@effect/typeclass/data/Identity'
import {HKT} from 'effect'

/*
 * A function of type: `(fa: Outer<Inner<A, E, R, I>, E, R, I>) ⇒ A`.
 * @category fold
 */
export interface Folder<
  Outer extends HKT.TypeLambda,
  Inner extends HKT.TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> {
  (fa: HKT.Kind<Outer, I, R, E, HKT.Kind<Inner, I, R, E, A>>): A
}

/**
 * A function of the type: `(fa: F<A, E, R, I>) ⇒ A`.
 * @category fold
 */
export type Algebra<
  F extends HKT.TypeLambda,
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
  F extends HKT.TypeLambda,
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
  F extends HKT.TypeLambda,
  A,
  B,
  E = unknown,
  R = unknown,
  I = never,
> = Folder<F, TupleWithTypeLambda<B>, A, E, R, I>

/**
 * Same as `Algebra` except the `Fix` type on the left side is replaced with a
 * `Cofree`. A function of the type:
 * `(fa: F<Cofree<F, A, E, R, I>, E, R, I>) ⇒ A`.
 * @category fold
 */
export type CVAlgebra<
  F extends HKT.TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = Folder<F, CofreeTypeLambda<F>, A, E, R, I>

export interface AlgebraTypeLambda<F extends HKT.TypeLambda>
  extends HKT.TypeLambda {
  readonly type: Algebra<
    F,
    this['Target'],
    this['Out1'],
    this['Out2'],
    this['In']
  >
}

export interface TupleWithTypeLambda<B> extends HKT.TypeLambda {
  readonly type: [this['Target'], B]
}

/**
 * The return type for all folding schemes is a function
 * `Fix<F> ⇒ A`.
 * @category fold
 */
export interface Fold<
  F extends HKT.TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> {
  (fixed: Fix<F, E, R, I>): A
}

/**
 * Type of folds with a single carrier type `A`.
 * @folds
 */
export interface UnaryFold<T extends HKT.TypeLambda, F extends HKT.TypeLambda> {
  <A, E = unknown, R = unknown, I = never>(
    φ: Folder<F, T, A, E, R, I>,
  ): Fold<F, A, E, R, I>
}

/**
 * `Algebra ⇒ Fold`.
 * @folds
 */
export interface Catamorphism {
  <F extends HKT.TypeLambda>(F: TA.Traversable<F>): UnaryFold<Id, F>
}

/**
 * `RAlgebra ⇒ Fold`.
 * @folds
 */
export interface Paramorphism {
  <F extends HKT.TypeLambda>(
    F: TA.Traversable<F>,
  ): UnaryFold<ProductTypeLambda<F>, F>
}

/**
 * `CVAlgebra ⇒ Fold`.
 * @folds
 */
export interface Histomorphism {
  <F extends HKT.TypeLambda>(
    F: TA.Traversable<F>,
  ): UnaryFold<CofreeTypeLambda<F>, F>
}

export interface Zygomorphism {
  <F extends HKT.TypeLambda>(
    F: TA.Traversable<F>,
  ): <A, B, E = unknown, R = unknown, I = never>(
    f: DistLeft<F, A, B, E, R, I>,
    φ: Algebra<F, B, E, R, I>,
  ) => Fold<F, A, E, R, I>
}
