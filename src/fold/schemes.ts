import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {fix, Fix, unfix} from '../fix.js'
import {fanout, pairWithFirst} from '../pair.js'
import {hylo, hyloE} from '../refold/schemes.js'
import {Algebra, EffectAlgebra, RAlgebra, ZDist} from './folds.js'

export type Catamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, Out1 = unknown, Out2 = unknown, In1 = never>(
  φ: Algebra<F, A, Out1, Out2, In1>,
) => (fixed: Fix<F, Out1, Out2, In1>) => A

export const cata: Catamorphism = F => φ => hylo(F)(unfix, φ)

export const para =
  <F extends TypeLambda>(F: CO.Covariant<F> & TA.Traversable<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: RAlgebra<F, A, Out1, Out2, In1>,
  ) =>
  (fixed: Fix<F, Out1, Out2, In1>): A =>
    pipe(
      fixed,
      hylo(F)(
        unfix<F, Out1, Out2, In1>,
        fanout(flow(F.map(TU.getFirst), fix), φ),
      ),
      TU.getSecond,
    )

export const zygo =
  <F extends TypeLambda>(F: CO.Covariant<F> & TA.Traversable<F>) =>
  <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
    f: ZDist<F, A, B, Out1, Out2, In1>,
    φ: Algebra<F, B, Out1, Out2, In1>,
  ): ((fa: Fix<F, Out1, Out2, In1>) => A) => {
    const fold = cata(F)((fab: Kind<F, In1, Out2, Out1, [A, B]>): [A, B] =>
      pipe(fab, F.map(TU.getSecond), φ, pairWithFirst(f(fab))),
    )

    return flow(fold, TU.getFirst)
  }

export const cataE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: EffectAlgebra<F, A, E, R, Out1, Out2, In1>,
  ) =>
  (fixed: Fix<F, Out1, Out2, In1>): EF.Effect<A, E, R> =>
    pipe(
      fixed,
      hyloE(F)(fixed => pipe(fixed, unfix, EF.succeed), φ),
    )
