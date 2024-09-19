import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {flow, pipe, Tuple as TU} from 'effect'
import {Law, LawSet} from 'effect-ts-laws'
import {TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {fix, Fix, unfix, Unfixed} from '../fix.js'
import {Given} from '../laws.js'
import {Algebra} from './folds.js'
import {cata, para} from './schemes.js'

export const cataLaws =
  <F extends TypeLambda, A>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  ({equalsF, equalsA, fixed, φ}: Given<F, A>) => {
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
          pipe(unfixed, F.map(cataF(φ)), φ),
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

export const paraLaws =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A>({fixed, equalsA, φ}: Given<F, A>) => {
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

const standaloneCata =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: Algebra<F, A, Out1, Out2, In1>,
  ) =>
  (fixed: Fix<F, Out1, Out2, In1>): A =>
    pipe(fixed, unfix, F.map(standaloneCata(F)(φ)), φ)

const paraBasedCata =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: Algebra<F, A, Out1, Out2, In1>,
  ) =>
  (fixed: Fix<F, Out1, Out2, In1>): A =>
    pipe(fixed, para(F)(flow(F.map(TU.getSecond), ψ)))
