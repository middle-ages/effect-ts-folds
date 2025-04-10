import {HKT, flow} from 'effect'
import {cata} from '../fold/schemes.js'
import {ana} from '../unfold/schemes.js'
import {Hylomorphism} from './refolds.js'
import {Traversable} from '@effect/typeclass'
import {Given} from '#laws'
import {Law, LawSet} from 'effect-ts-laws'
import {hylo} from './schemes.js'

export const hyloLaws = <F extends HKT.TypeLambda, A, B>(
  F: Traversable.Traversable<F>,
  {equalsA, a, φ, ψ}: Given<F, A, B>,
) => {
  return LawSet()(
    'hylomorphism',
    Law(
      'refold is unfold followed by fold',
      'hylo(φ, ψ) = cata(φ) ∘ ana(ψ)',
      a,
      ψ,
      φ,
    )((a, ψ, φ) => equalsA(hylo(F)(ψ, φ)(a), cataAnaBasedHylo(F)(ψ, φ)(a))),
  )
}

export const cataAnaBasedHylo: Hylomorphism = F => (ψ, φ) =>
  flow(ana(F)(ψ), cata(F)(φ))
