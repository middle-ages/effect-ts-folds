import {Effect as EF, pipe} from 'effect'
import {
  anaE,
  cataE,
  EffectAlgebra,
  EffectCoalgebra,
  EffectRAlgebra,
  fix,
  hyloE,
  paraE,
} from 'effect-ts-folds'
import {constant} from 'effect/Function'
import {Cons} from './cons.js'
import {ConsFLambda, instances, match} from './consF.js'

export type ConsFoldE = EffectAlgebra<ConsFLambda, number, string>
export type ConsRFoldE = EffectRAlgebra<ConsFLambda, Cons[], string>
export type ConsUnfoldE = EffectCoalgebra<ConsFLambda, number, string>

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

export const tailsUntilZero: ConsRFoldE = match(
  pipe([], EF.succeed, constant),
  ([fixed, conses], n) =>
    n === 0 ? EF.fail('got zero') : EF.succeed([fix([fixed, n]), ...conses]),
)

export const [consAnaE, consCataE, consHyloE, consParaE] = [
  anaE(instances),
  cataE(instances),
  hyloE(instances),
  paraE(instances),
]

export const [countCataE, rangeAnaE, countRangeE]: [
  (fa: Cons) => EF.Effect<number, string>,
  (n: number) => EF.Effect<Cons, string>,
  (n: number) => EF.Effect<number, string>,
] = [consCataE(countE), consAnaE(rangeE), consHyloE(rangeE, countE)]
