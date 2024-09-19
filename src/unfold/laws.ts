import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Either as EI, flow, pipe} from 'effect'
import {Law, LawSet} from 'effect-ts-laws'
import {TypeLambda} from 'effect/HKT'
import {fix, Fix, unfix} from '../fix.js'
import {Given} from '../laws.js'
import {ana, apo} from './schemes.js'
import {Coalgebra} from './unfolds.js'

export const anaLaws =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A>({a, equalsF, fixed, ψ}: Given<F, A>) => {
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
      )((a, ψ) => equalsF(pipe(a, anaF(ψ)), pipe(a, standaloneAna(F)(ψ)))),
    )
  }

export const apoLaws =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A>({a, equalsF, ψ}: Given<F, A>) => {
    return LawSet()(
      'apomorphism',

      Law(
        'ana consistency',
        'ana(ψ) = apo(F.map(Either.right) ∘ ψ) ',
        a,
        ψ,
      )((a, ψ) => equalsF(pipe(a, ana(F)(ψ)), pipe(a, apoBasedAna(F)(ψ)))),
    )
  }

const standaloneAna =
  <F extends TypeLambda>(F: CO.Covariant<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: Coalgebra<F, A, Out1, Out2, In1>,
  ) =>
  (a: A): Fix<F, Out1, Out2, In1> =>
    pipe(a, ψ, F.map(standaloneAna(F)(ψ)), fix)

export const apoBasedAna =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: Coalgebra<F, A, Out1, Out2, In1>,
  ) =>
  (a: A): Fix<F, Out1, Out2, In1> =>
    pipe(
      a,
      apo(F)(
        flow(ψ, F.map<A, EI.Either<A, Fix<F, Out1, Out2, In1>>>(EI.right)),
      ),
    )

/*

 def anaByApo[F[_]: Functor, A](coalgebra: Coalgebra[F, A])(a: A): Fix[F] = {
    val rcoalgebra: RCoalgebra[F, A] = (a: A) => coalgebra(a).map(v => Right(v))
    apo(rcoalgebra)(a)
  }


*/
