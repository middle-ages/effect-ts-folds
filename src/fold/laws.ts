import {Cofree, extract, Fix, fix, unfix, Unfixed} from '#fix'
import {fanout, square, squareMapFirst, traverseCovariant} from '#util'
import {Traversable} from '@effect/typeclass'
import {Array, flow, Function, HKT, pipe, Tuple} from 'effect'
import {Law, LawSet} from 'effect-ts-laws'
import fc from 'fast-check'
import {Given} from '../laws.js'
import {
  Catamorphism,
  CVAlgebra,
  Histomorphism,
  Paramorphism,
  RAlgebra,
} from './folds.js'
import {algebraToCVAlgebra, cata, histo, para, zygo} from './schemes.js'

export const cataLaws = <F extends HKT.TypeLambda, A, B>(
  F: Traversable.Traversable<F>,
  {equalsF, equalsA, fixed, φ}: Given<F, A, B>,
) => {
  const unfixed: fc.Arbitrary<Unfixed<F>> = fixed.map(unfix)

  return LawSet()(
    'catamorphism',

    Law(
      'identity',
      'cata(fix) = id',
      fixed,
    )(fixed => equalsF(pipe(fixed, cata(F)(fix)), fixed)),

    Law(
      'cancellation',
      'cata(φ) ∘ fix = φ ∘ map(cata(φ))',
      unfixed,
      φ,
    )((unfixed, φ) =>
      equalsA(
        pipe(unfixed, fix, cata(F)(φ)),
        pipe(unfixed, traverseCovariant(F).map(cata(F)(φ)), φ),
      ),
    ),

    Law(
      'standalone cata consistency',
      'cata(φ) = standaloneCata(φ)',
      fixed,
      φ,
    )((fixed, φ) =>
      equalsA(pipe(fixed, cata(F)(φ)), pipe(fixed, standaloneCata(F)(φ))),
    ),
  )
}

export const paraLaws = <F extends HKT.TypeLambda, A, B>(
  F: Traversable.Traversable<F>,
  {fixed, equalsA, equalsB, φ, rAlgebra}: Given<F, A, B>,
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

    Law(
      'standalone para consistency',
      'para(φ) = standalonePara(φ)',
      fixed,
      rAlgebra,
    )((fixed, φ) =>
      Array.getEquivalence(equalsB)(
        pipe(fixed, para(F)(φ)),
        pipe(fixed, standalonePara(F)(φ)),
      ),
    ),
  )
}

export const zygoLaws = <F extends HKT.TypeLambda, A>(
  F: Traversable.Traversable<F>,
  {fixed, equalsF, rAlgebra}: Given<F, A, Fix<F>>,
) => {
  return LawSet()(
    'zygomorphism',

    Law(
      'para consistency',
      'para(φ) = zygo(φ ∘ F.map(Tuple.swap), fix)',
      fixed,
      rAlgebra,
    )((fixed, φ) =>
      pipe(
        fixed,
        fanout(para(F)(φ), zygoBasedPara(F)(φ)),
        Function.tupled(Array.getEquivalence(equalsF)),
      ),
    ),
  )
}

export const histoLaws = <F extends HKT.TypeLambda, A>(
  F: Traversable.Traversable<F>,
  {fixed, equalsA, cvAlgebra, φ}: Given<F, A, Fix<F>>,
) => {
  return LawSet()(
    'histomorphism',

    Law(
      'standalone histo consistency',
      'histo(φ) = standaloneHisto(φ)',
      fixed,
      cvAlgebra,
    )((fixed, φ) =>
      Array.getEquivalence(equalsA)(
        pipe(fixed, histo(F)(φ)),
        pipe(fixed, standaloneHisto(F)(φ)),
      ),
    ),

    Law(
      'cata consistency',
      'cata(φ) = histo(φ ∘ F.map(Cofree.extract))',
      fixed,
      φ,
    )((fixed, φ) =>
      equalsA(pipe(fixed, cata(F)(φ)), pipe(fixed, histoBasedCata(F)(φ))),
    ),
  )
}

const standaloneCata: Catamorphism = F => φ => fixed =>
  pipe(fixed, unfix, traverseCovariant(F).map(standaloneCata(F)(φ)), φ)

export const standalonePara: Paramorphism =
  <F extends HKT.TypeLambda>(F: Traversable.Traversable<F>) =>
  <A, E = unknown, R = unknown, I = never>(φ: RAlgebra<F, A, E, R, I>) =>
  (fixed: Fix<F, E, R, I>) =>
    pipe(
      fixed,
      unfix,
      traverseCovariant(F).map(
        flow(
          square,
          pipe(φ, standalonePara(F), Tuple.mapSecond<Fix<F, E, R, I>, A>),
        ),
      ),
      φ,
    )

const paraBasedCata: Catamorphism = F => φ =>
  para(F)(flow(traverseCovariant(F).map(Tuple.getSecond), φ))

export const histoBasedCata: Catamorphism = F =>
  flow(algebraToCVAlgebra(F), histo(F))

export const zygoBasedPara: Paramorphism =
  <F extends HKT.TypeLambda>(F: Traversable.Traversable<F>) =>
  <A, E = unknown, R = unknown, I = never>(φ: RAlgebra<F, A, E, R, I>) =>
    zygo(F)<A, Fix<F, E, R, I>, E, R, I>(
      flow(traverseCovariant(F).map(Tuple.swap), φ),
      fix,
    )

export const standaloneHisto: Histomorphism =
  <F extends HKT.TypeLambda>(F: Traversable.Traversable<F>) =>
  <A, E, R, I>(φ: CVAlgebra<F, A, E, R, I>) => {
    const run = (fixed: Fix<F, E, R, I>): Cofree<F, A, E, R, I> =>
      pipe(
        fixed,
        unfix<F, E, R, I>,
        traverseCovariant(F).map(run),
        squareMapFirst(φ),
      )

    return flow(run, extract)
  }
