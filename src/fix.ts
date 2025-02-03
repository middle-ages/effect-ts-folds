import {Either as EI} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'

export interface Fix<F extends TypeLambda, E = unknown, R = never> {
  unfixed: Unfixed<F, E, R>
}

export type Unfixed<F extends TypeLambda, E = unknown, R = never> = Kind<
  F,
  R,
  unknown,
  E,
  Fix<F, E, R>
>

export interface FixTypeLambda extends TypeLambda {
  readonly type: Fix<this['Target'] & TypeLambda, this['Out1'], this['In']>
}

export const fix: <F extends TypeLambda, E = unknown, R = never>(
  unfixed: Unfixed<F, E, R>,
) => Fix<F, E, R> = unfixed => ({unfixed})

export const unfix: <F extends TypeLambda, E = unknown, R = never>(
  fixed: Fix<F, E, R>,
) => Unfixed<F, E, R> = fixed => fixed.unfixed

/**
 * The higher-kinded type `[Fix<F, E, R>, A]` used in `RAlgebra`.
 * @category recursive
 */
export interface ProductTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: [Fix<F, this['Out1'], this['In']>, this['Target']]
}

/**
 * The higher-kinded type `Either<A, Fix<F, E, R>>` used in
 * `RCoalgebra`.
 * @category recursive
 */
export interface SumTypeLambda<F extends TypeLambda> extends TypeLambda {
  readonly type: EI.Either<this['Target'], Fix<F, this['Out1'], this['In']>>
}
