import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {fix, unfix} from '../fix.js'
import {fanout, pairWithFirst} from '../pair.js'
import {hylo, hyloE} from '../refold/schemes.js'
import {
  Algebra,
  DistLeft,
  EffectAlgebra,
  EffectFold,
  Fold,
  RAlgebra,
} from './folds.js'

export type Catamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F> & CO.Covariant<F>,
) => <A, Out1 = unknown, Out2 = unknown, In1 = never>(
  φ: Algebra<F, A, Out1, Out2, In1>,
) => Fold<F, A, Out1, Out2, In1>

export type Paramorphism = <F extends TypeLambda>(
  F: TA.Traversable<F> & CO.Covariant<F>,
) => <A, Out1 = unknown, Out2 = unknown, In1 = never>(
  φ: RAlgebra<F, A, Out1, Out2, In1>,
) => Fold<F, A, Out1, Out2, In1>

export type Zygomorphism = <F extends TypeLambda>(
  F: TA.Traversable<F> & CO.Covariant<F>,
) => <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
  f: DistLeft<F, A, B, Out1, Out2, In1>,
  φ: Algebra<F, B, Out1, Out2, In1>,
) => Fold<F, A, Out1, Out2, In1>

export const cata: Catamorphism = F => φ => hylo(F)(unfix, φ)

export const para: Paramorphism =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: RAlgebra<F, A, Out1, Out2, In1>,
  ) =>
    flow(
      hylo(F)(
        unfix<F, Out1, Out2, In1>,
        fanout(flow(F.map(TU.getFirst), fix), φ),
      ),
      TU.getSecond,
    )

export const zygo: Zygomorphism =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
    f: DistLeft<F, A, B, Out1, Out2, In1>,
    φ: Algebra<F, B, Out1, Out2, In1>,
  ) =>
    flow(
      cata(F)((fab: Kind<F, In1, Out2, Out1, [A, B]>) =>
        pipe(fab, F.map(TU.getSecond), φ, pairWithFirst(f(fab))),
      ),
      TU.getFirst,
    )

export const cataE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: EffectAlgebra<F, A, E, R, Out1, Out2, In1>,
  ): EffectFold<F, A, E, R, Out1, Out2, In1> =>
    hyloE(F)(flow(unfix, EF.succeed), φ)
