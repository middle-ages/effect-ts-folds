import {Either as EI} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

/**
 * @category recursive
 */
export interface Fix<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> {
  unfixed: HFix<F, In1, Out2, Out1>
}

/**
 * @category recursive
 */
export type HFix<
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
> = Kind<F, In1, Out2, Out1, Fix<F, In1, Out2, Out1>>

/**
 * @category recursive
 */
export const fix: <
  F extends TypeLambda,
  In1 = never,
  Out2 = unknown,
  Out1 = unknown,
>(
  unfixed: HFix<F, In1, Out2, Out1>,
) => Fix<F, In1, Out2, Out1> = unfixed => ({unfixed})

/**
 * @category recursive
 */
export const unfix: <F extends TypeLambda, In1, Out2, Out1>(
  fixed: Fix<F, In1, Out2, Out1>,
) => HFix<F, In1, Out2, Out1> = fixed => fixed.unfixed

/**
 * The higher-kinded type `[Fix<F, I₁, O₂, O₁>, A]` used in
 * `RAlgebra`.
 * @category recursive
 */
export interface ProductTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: [
    Fix<F, this['In'], this['Out2'], this['Out1']>,
    this['Target'],
  ]
}

/**
 * The higher-kinded type `Either<A, Fix<F, I₁, O₂, O₁>>` used in
 * `RCoalgebra`.
 * @category recursive
 */
export interface SumTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: EI.Either<
    this['Target'],
    Fix<F, this['In'], this['Out2'], this['Out1']>
  >
}

/*

export interface FixLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: Fix<F, this['Target']>
}


export const fixWith =
  <F extends TypeLambda>() =>
  <A>(unfixed: HFix<F, A>): Fix<F, A> => ({unfixed})

export const unfixWith =
  <F extends TypeLambda>() =>
  <A>(fixed: Fix<F, A>): HFix<F, A> =>
    unfix(fixed)

  */
