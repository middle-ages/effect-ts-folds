import {
  Applicative as AP,
  Covariant as CO,
  Traversable as TA,
} from '@effect/typeclass'
import {Array as AR, flow, pipe} from 'effect'
import {fix, Fix, unfix} from 'effect-ts-folds'
import {constant, dual, LazyArg} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'

export type ConsF<T> = null | [number, T]

export type Cons = Fix<ConsFLambda>

export interface ConsFLambda extends TypeLambda {
  readonly type: ConsF<this['Target']>
}

export const match =
  <T, R>(last: LazyArg<R>, init: (head: number, tail: T) => R) =>
  (l: ConsF<T>) =>
    l === null ? last() : init(...l)

export const map: CO.Covariant<ConsFLambda>['map'] = dual(
  2,
  <A, B>(fa: ConsF<A>, f: (a: A) => B) =>
    pipe(
      fa,
      match<A, ConsF<B>>(
        () => null,
        (head, tail) => [head, f(tail)],
      ),
    ),
)

const sequence =
  <F extends TypeLambda>(F: AP.Applicative<F>) =>
  <T>(
    l: ConsF<Kind<F, never, unknown, unknown, T>>,
  ): Kind<F, never, unknown, unknown, ConsF<T>> =>
    pipe(
      l,
      match(pipe(emptyF<T>(), F.of, constant), (head, tail) =>
        F.map(tail, (tail): ConsF<T> => [head, tail]),
      ),
    )

const traverse: TA.Traversable<ConsFLambda>['traverse'] = <
  F extends TypeLambda,
>(
  F: AP.Applicative<F>,
) =>
  dual(
    2,
    <A, B>(l: ConsF<A>, f: (a: A) => Kind<F, never, unknown, unknown, B>) =>
      pipe(l, map(f), sequence(F)),
  )

export const instances: CO.Covariant<ConsFLambda> &
  TA.Traversable<ConsFLambda> = {
  map,
  imap: CO.imap<ConsFLambda>(map),
  traverse,
}

export const emptyF = <T>(): ConsF<T> => null
export const empty: Cons = fix(emptyF<Cons>())
export const singleton: (n: number) => Cons = n => fix([n, empty])
export const prepend: (l: Cons, n: number) => Cons = (l, n) => fix([n, l])

export const fromArray: (ns: number[]) => Cons = flow(
  AR.reverse,
  AR.reduce(empty, prepend),
)

export const toArray: (c: Cons) => number[] = c => {
  const result: number[] = []
  let current = unfix(c)
  while (current !== null) {
    const [head, tail] = current
    result.push(head)
    current = unfix(tail)
  }
  return result
}
