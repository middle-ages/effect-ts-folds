import {
  Applicative as AP,
  Covariant as CO,
  Traversable as TA,
} from '@effect/typeclass'
import {pipe} from 'effect'
import {constant, dual, LazyArg} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'

export type ConsF<T> = null | [T, number]

export interface ConsFLambda extends TypeLambda {
  readonly type: ConsF<this['Target']>
}

export const ConsF = <T>(data: null | [T, number]): ConsF<T> => data

export const match =
  <T, R>(onEmpty: LazyArg<R>, onNonEmpty: (tail: T, head: number) => R) =>
  (l: ConsF<T>): R =>
    l === null ? onEmpty() : onNonEmpty(...l)

export const map: CO.Covariant<ConsFLambda>['map'] = dual(
  2,
  <A, B>(fa: ConsF<A>, f: (a: A) => B) =>
    pipe(
      fa,
      match<A, ConsF<B>>(constant(null), (tail, head) => [f(tail), head]),
    ),
)

export const instances: CO.Covariant<ConsFLambda> &
  TA.Traversable<ConsFLambda> = {
  map,
  imap: CO.imap<ConsFLambda>(map),
  traverse: <F extends TypeLambda>(F: AP.Applicative<F>) =>
    dual(
      2,
      <A, B>(l: ConsF<A>, f: (a: A) => Kind<F, never, unknown, unknown, B>) =>
        pipe(
          l,
          map(f),
          match(pipe(ConsF<B>(null), F.of, constant), (tail, head) =>
            F.map(tail, (tail): ConsF<B> => [tail, head]),
          ),
        ),
    ),
}
