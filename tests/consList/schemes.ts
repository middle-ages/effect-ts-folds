import {Effect as EF, Either as EI, Number as NU, pipe} from 'effect'
import {
  Algebra,
  ana,
  anaE,
  apo,
  cata,
  cataE,
  Coalgebra,
  DistLeft,
  EffectAlgebra,
  EffectCoalgebra,
  fix,
  hylo,
  hyloE,
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

export type ConsFoldE = EffectAlgebra<ConsFLambda, number, string>
export type ConsUnfoldE = EffectCoalgebra<ConsFLambda, number, string>

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
  ([first, tail], head) => [fix([first, head]), ...tail],
)

export const flip: Algebra<ConsFLambda, boolean> = match(
  constTrue,
  (tail, _) => !tail,
)

export const alternateSum: DistLeft<ConsFLambda, number, boolean> = match(
  constant(0),
  ([previous, flag], current) => previous + (flag ? 1 : -1) * current,
)

export const [countE, rangeE]: [ConsFoldE, ConsUnfoldE] = [
  match(pipe(0, EF.succeed, constant), tail =>
    tail === 2 ? EF.fail('no more cata') : EF.succeed(tail + 1),
  ),
  n =>
    n === 0
      ? EF.succeed(null)
      : n === 4
        ? EF.fail('no more ana')
        : EF.succeed([n - 1, n]),
]

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

export const [consCataE, consAnaE, consHyloE] = [
  cataE(instances),
  anaE(instances),
  hyloE(instances),
]

export const [countCataE, rangeAnaE, countRangeE]: [
  (fa: Cons) => EF.Effect<number, string>,
  (n: number) => EF.Effect<Cons, string>,
  (n: number) => EF.Effect<number, string>,
] = [consCataE(countE), consAnaE(rangeE), consHyloE(rangeE, countE)]

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
