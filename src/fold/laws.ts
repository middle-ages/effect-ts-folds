import {Traversable as TA} from '@effect/typeclass'
import {Array as AR, flow, pipe, Tuple as TU} from 'effect'
import {Law, LawSet} from 'effect-ts-laws'
import {tupled} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Fix, fix, unfix, Unfixed} from '../fix.js'
import {Given} from '../laws.js'
import {fanout, traverseCovariant} from '../util.js'
import {Catamorphism, Paramorphism, RAlgebra} from './folds.js'
import {cata, para, zygo} from './schemes.js'

export const cataLaws = <F extends TypeLambda, A, B>(
  F: TA.Traversable<F>,
  {equalsF, equalsA, fixed, φ}: Given<F, A, B>,
) => {
  const unfixed: fc.Arbitrary<Unfixed<F>> = fixed.map(unfix),
    cataF = cata(F)

  return LawSet()(
    'catamorphism',

    Law(
      'identity',
      'cata(fix) = id',
      fixed,
    )(fixed => equalsF(pipe(fixed, cataF(fix)), fixed)),

    Law(
      'cancellation',
      'cata(φ) ∘ fix = φ ∘ map(cata(φ))',
      unfixed,
      φ,
    )((unfixed, φ) =>
      equalsA(
        pipe(unfixed, fix, cataF(φ)),
        pipe(unfixed, traverseCovariant(F).map(cataF(φ)), φ),
      ),
    ),

    Law(
      'hylo consistency',
      'cata(φ) = hylo(unfix, φ)',
      fixed,
      φ,
    )((fixed, φ) =>
      equalsA(pipe(fixed, cataF(φ)), pipe(fixed, standaloneCata(F)(φ))),
    ),
  )
}

export const paraLaws = <F extends TypeLambda, A, B>(
  F: TA.Traversable<F>,
  {fixed, equalsA, φ}: Given<F, A, B>,
) => {
  return LawSet()(
    'paramorphism',

    Law(
      'cata consistency',
      'cata(φ) = para(φ ∘ F.map(Tuple.getSecond))',
      fixed,
      φ,
    )((fixed, φ) =>
      equalsA(pipe(fixed, cata(F)(φ)), pipe(fixed, paraBasedCata(F)(φ))),
    ),
  )
}

export const zygoLaws = <F extends TypeLambda, A>(
  F: TA.Traversable<F>,
  {fixed, equalsF, ralgebra}: Given<F, A, Fix<F>>,
) => {
  return LawSet()(
    'zygomorphism',

    Law(
      'para consistency',
      'para(φ) = zygo(φ ∘ F.map(Tuple.swap), fix)',
      fixed,
      ralgebra,
    )((fixed, φ) =>
      pipe(
        fixed,
        fanout(para(F)(φ), zygoBasedPara(F)(φ)),
        tupled(AR.getEquivalence(equalsF)),
      ),
    ),
  )
}

const standaloneCata: Catamorphism = F => φ => fixed =>
  pipe(fixed, unfix, traverseCovariant(F).map(standaloneCata(F)(φ)), φ)

const paraBasedCata: Catamorphism = F => φ =>
  para(F)(flow(traverseCovariant(F).map(TU.getSecond), φ))

export const zygoBasedPara: Paramorphism =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E = unknown, R = never>(φ: RAlgebra<F, A, E, R>) =>
    zygo(F)(
      (fa: Kind<F, R, unknown, E, [A, Fix<F, E, R>]>) =>
        pipe(fa, traverseCovariant(F).map(TU.swap), φ),
      fix,
    )
