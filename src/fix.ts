import {Either as EI} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export interface Fix<
  F extends TypeLambda,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> {
  unfixed: Unfixed<F, Out1, Out2, In1>
}

export type Unfixed<
  F extends TypeLambda,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
> = Kind<F, In1, Out2, Out1, Fix<F, Out1, Out2, In1>>

export interface FixTypeLambda extends TypeLambda {
  readonly type: Fix<
    this['Target'] & TypeLambda,
    this['Out1'],
    this['Out2'],
    this['In']
  >
}

export const fix: <
  F extends TypeLambda,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
>(
  unfixed: Unfixed<F, Out1, Out2, In1>,
) => Fix<F, Out1, Out2, In1> = unfixed => ({unfixed})

export const unfix: <
  F extends TypeLambda,
  Out1 = unknown,
  Out2 = unknown,
  In1 = never,
>(
  fixed: Fix<F, Out1, Out2, In1>,
) => Unfixed<F, Out1, Out2, In1> = fixed => fixed.unfixed

/**
 * The higher-kinded type `[Fix<F, I₁, O₂, O₁>, A]` used in
 * `RAlgebra`.
 * @category recursive
 */
export interface ProductTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: [
    Fix<F, this['Out1'], this['Out2'], this['In']>,
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
    Fix<F, this['Out1'], this['Out2'], this['In']>
  >
}
