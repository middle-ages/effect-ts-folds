import {Number as NU, pipe} from 'effect'
import {anaLaws, cataLaws, Given} from 'effect-ts-folds'
import {tinyInteger, verboseLaws} from 'effect-ts-laws'
import fc from 'fast-check'
import {equivalence as equalsF, arbitrary as fixed} from './consList/cons.js'
import {ConsFLambda, instances} from './consList/consF.js'
import {count, halves} from './consList/schemes.js'

describe('laws', () => {
  const given: Given<ConsFLambda, number> = {
    equalsA: NU.Equivalence,
    equalsF,
    a: tinyInteger,
    fixed,
    φ: fc.constant(count),
    ψ: fc.constant(halves),
  }

  for (const laws of [cataLaws, anaLaws])
    pipe(given, laws(instances), verboseLaws)
})
