import {HKT} from 'effect'

/** `Cofree<F, A> ≡ [A, F<Cofree<F, A>>]` */
export type Cofree<
  F extends HKT.TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
> = [A, HKT.Kind<F, I, R, E, Cofree<F, A, E, R, I>>]

/**
 * ```ts
 * Kind<CofreeTypeLambda<F>, E, R, I, A> ≡ Cofree<F, A, E, R, I>
 * ```
 */
export interface CofreeTypeLambda<F extends HKT.TypeLambda>
  extends HKT.TypeLambda {
  readonly type: Cofree<
    F,
    this['Target'],
    this['Out1'],
    this['Out2'],
    this['In']
  >
}

export const extract = <
  F extends HKT.TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
>([head]: Cofree<F, A, E, R, I>): A => head

export const unwrap = <
  F extends HKT.TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
>([_, tail]: Cofree<F, A, E, R, I>): HKT.Kind<
  F,
  I,
  R,
  E,
  Cofree<F, A, E, R, I>
> => tail
