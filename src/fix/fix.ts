import {Either as EI} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export interface Fix<
  F extends TypeLambda,
  E = unknown,
  R = unknown,
  I = never,
> {
  unfixed: Unfixed<F, E, R, I>
}

export type Unfixed<
  F extends TypeLambda,
  E = unknown,
  R = unknown,
  I = never,
> = Kind<F, I, R, E, Fix<F, E, R, I>>

export const fix: <F extends TypeLambda, E = unknown, R = unknown, I = never>(
  unfixed: Unfixed<F, E, R, I>,
) => Fix<F, E, R, I> = unfixed => ({unfixed})

export const unfix: <F extends TypeLambda, E = unknown, R = unknown, I = never>(
  fixed: Fix<F, E, R, I>,
) => Unfixed<F, E, R, I> = fixed => fixed.unfixed

/**
 * `TypeLambda` for the higher-kinded type `[Fix<F, E, R, I>, A]` used in
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
 * `TypeLambda` for the higher-kinded type `Either<A, Fix<F, E, R, I>>` used in
 * `RCoalgebra`.
 * @category recursive
 */
export interface SumTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: EI.Either<
    this['Target'],
    Fix<F, this['Out1'], this['Out2'], this['In']>
  >
}
