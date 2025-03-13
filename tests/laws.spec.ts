import {Array as AR, Number as NU, pipe} from 'effect'
import {
  anaLaws,
  apoLaws,
  cataLaws,
  Given,
  paraLaws,
  unfix,
  zygoLaws,
} from 'effect-ts-folds'
import {tinyInteger} from 'effect-ts-laws'
import {verboseLaws} from 'effect-ts-laws/vitest'
import {constant} from 'effect/Function'
import fc from 'fast-check'
import {
  Cons,
  equivalence as equalsF,
  arbitrary as fixed,
} from './consList/cons.js'
import {ConsFLambda, instances, map} from './consList/consF.js'
import {count, halves, tails} from './consList/schemes.js'

describe('laws', () => {
  const given: Given<ConsFLambda, number, Cons> = {
    equalsA: NU.Equivalence,
    equalsF,
    a: tinyInteger,
    fa: fc
      .tuple(fixed, tinyInteger)
      .map(([fixed, n]) => map(unfix(fixed), constant(n))),
    fixed,
    φ: fc.constant(count),
    ψ: fc.constant(halves),
    ralgebra: fc.constant(tails),
  }

  for (const lawSet of [
    ...pipe(
      [cataLaws, paraLaws, zygoLaws],
      AR.map(l => l(instances, given)),
    ),

    ...pipe(
      [anaLaws, apoLaws],
      AR.map(l => l(instances, given)),
    ),
  ])
    verboseLaws(lawSet)
})
