import {fix, Fix, unfix} from '#fix'
import {Given} from '#laws'
import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Either as EI, flow, pipe} from 'effect'
import {Law, LawSet} from 'effect-ts-laws'
import {TypeLambda} from 'effect/HKT'
import {hylo} from '../refold.js'
import {ana, apo} from './schemes.js'
import {Coalgebra, Unfold} from './unfolds.js'

export const anaLaws = <F extends TypeLambda, A, B>(
  F: TA.Traversable<F> & CO.Covariant<F>,
  {a, equalsF, fixed, ψ}: Given<F, A, B>,
) => {
  const anaF = ana(F)

  return LawSet()(
    'anamorphism',

    Law(
      'identity',
      'ana(unfix) = id',
      fixed,
    )(fixed => equalsF(pipe(fixed, anaF(unfix)), fixed)),

    Law(
      'hylo consistency',
      'ana(ψ) = hylo(ψ, fix)',
      a,
      ψ,
    )((a, ψ) => equalsF(pipe(a, anaF(ψ)), pipe(a, hylo(F)(ψ, fix)))),

    Law(
      'standalone ana consistency',
      'ana(ψ) = standaloneAna(ψ)',
      a,
      ψ,
    )((a, ψ) => equalsF(pipe(a, anaF(ψ)), pipe(a, standaloneAna(F, ψ)))),
  )
}

export const apoLaws = <F extends TypeLambda, A, B>(
  F: TA.Traversable<F> & CO.Covariant<F>,
  {a, equalsF, ψ}: Given<F, A, B>,
) => {
  return LawSet()(
    'apomorphism',

    Law(
      'ana consistency',
      'ana(ψ) = apo(F.map(Either.right) ∘ ψ) ',
      a,
      ψ,
    )((a, ψ) => equalsF(pipe(a, ana(F)(ψ)), pipe(a, apoBasedAna(F, ψ)))),
  )
}

const standaloneAna =
  <F extends TypeLambda, A, E = unknown, R = unknown, I = never>(
    F: CO.Covariant<F>,
    ψ: Coalgebra<F, A, E, R, I>,
  ): Unfold<F, A, E, R, I> =>
  a =>
    pipe(a, ψ, F.map(standaloneAna(F, ψ)), fix)

export const apoBasedAna = <
  F extends TypeLambda,
  A,
  E = unknown,
  R = unknown,
  I = never,
>(
  F: TA.Traversable<F> & CO.Covariant<F>,
  ψ: Coalgebra<F, A, E, R, I>,
): Unfold<F, A, E, R, I> =>
  apo(F)(flow(ψ, F.map<A, EI.Either<A, Fix<F, E, R, I>>>(EI.right)))
