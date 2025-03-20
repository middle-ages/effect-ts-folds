import {HKT} from 'effect'

export type Composed<
  Outer extends HKT.TypeLambda,
  Inner extends HKT.TypeLambda,
  A,
  E1 = unknown,
  R1 = unknown,
  I1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> = HKT.Kind<Outer, I1, R1, E1, HKT.Kind<Inner, I2, R2, E2, A>>

/**
 * The function type:
 * ```
 * (o: Outer<Inner<A>>) ⇒ Returns<B>
 * ```
 */
export interface ComposedUnary<
  Outer extends HKT.TypeLambda,
  Inner extends HKT.TypeLambda,
  Returns extends HKT.TypeLambda,
  A,
  B,
  E1 = unknown,
  R1 = unknown,
  I1 = never,
  E2 = unknown,
  R2 = unknown,
  I2 = never,
> {
  (
    o: Composed<Outer, Inner, A, E1, R1, I1, E2, R2, I2>,
  ): HKT.Kind<Returns, I2, R2, E2, B>
}
