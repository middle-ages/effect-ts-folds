import {Either as EI, Number as NU, pipe} from 'effect'
import {
  Algebra,
  ana,
  apo,
  cata,
  Coalgebra,
  DistLeft,
  fix,
  hylo,
  para,
  RAlgebra,
  RCoalgebra,
  unfix,
  zygo,
} from 'effect-ts-folds'
import {constant, constNull, constTrue} from 'effect/Function'
import {TupleOf} from 'effect/Types'
import {Cons, empty} from './cons.js'
import {ConsF, ConsFLambda, instances, match} from './consF.js'

export type ConsFold = Algebra<ConsFLambda, number>
export type ConsUnfold = Coalgebra<ConsFLambda, number>

export const [count, sum, product, max]: TupleOf<4, ConsFold> = [
  match(constant(0), NU.increment),
  match(constant(0), NU.sum),
  match(constant(1), NU.multiply),
  match(constant(Number.NEGATIVE_INFINITY), NU.max),
]

export const [range, halves]: TupleOf<2, ConsUnfold> = [
  n => (n === 0 ? null : [n - 1, n]),
  n => ConsF(n < 1 ? null : [n / 2, n]),
]

export const tails: RAlgebra<ConsFLambda, Cons[]> = match(
  () => [],
  ([fixed, conses], n) => [fix([fixed, n]), ...conses],
)

export const flip: Algebra<ConsFLambda, boolean> = match(
  constTrue,
  (tail, _) => !tail,
)

export const alternateSum: DistLeft<ConsFLambda, number, boolean> = match(
  constant(0),
  ([previous, flag], current) => previous + (flag ? 1 : -1) * current,
)

export const [consCata, consAna, consHylo, consPara, consApo, consZygo] = [
  cata(instances),
  ana(instances),
  hylo(instances),
  para(instances),
  apo(instances),
  zygo(instances),
]

export const [countCata, rangeAna, countRange]: [
  (fixed: Cons) => number,
  (max: number) => Cons,
  (max: number) => number,
] = [consCata(count), consAna(range), consHylo(range, count)]

export const unfoldUntil: RCoalgebra<ConsFLambda, [number, Cons]> = ([
  needle,
  haystack,
]) =>
  pipe(
    haystack,
    unfix,
    match<Cons, ConsF<EI.Either<[number, Cons], Cons>>>(
      constNull,
      (tail, head) =>
        head === needle
          ? [EI.left(empty), needle]
          : [EI.right([needle, tail]), head],
    ),
  )

export const takeUntil = consApo(unfoldUntil)
