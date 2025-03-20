import {Cofree, extract, Fix, fix, unfix} from '#fix'
import {
  fanout,
  pairWithFirst,
  pairWithSecond,
  succeedBy,
  traverseCovariant,
  traverseSuspended,
} from '#util'
import {Traversable as TA, Traversable} from '@effect/typeclass'
import {Effect, flow, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {hyloE} from '../refold/schemes.js'
import {
  CatamorphismE,
  EffectAlgebra,
  EffectCVAlgebra,
  EffectRAlgebra,
  HistomorphismE,
  ParamorphismE,
  ZygomorphismE,
} from './effect.js'
import {
  Algebra,
  Catamorphism,
  CVAlgebra,
  DistLeft,
  Histomorphism,
  Paramorphism,
  Zygomorphism,
} from './folds.js'

export const cataE: CatamorphismE = F => φ =>
  hyloE(F)(a => pipe(a, unfix, Effect.succeed), φ)

export const paraE: ParamorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
    φ: EffectRAlgebra<F, A, E1, R1, E2, R2, I2>,
  ) =>
  (fixed: Fix<F, E2, R2, I2>) =>
    pipe(
      fixed,
      cataE(F)((fa: Kind<F, I2, R2, E2, [typeof fixed, A]>) => {
        const [fixed, effect] = pipe(
          fa,
          fanout(flow(traverseCovariant(F).map(TU.getFirst), fix), φ),
        )
        return pipe(effect, Effect.map(pairWithFirst(fixed)))
      }),
      Effect.map(TU.getSecond),
    )

export const zygoE: ZygomorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E1 = unknown, R1 = never, E2 = unknown, R2 = unknown, I2 = never>(
    f: DistLeft<F, A, B, E2, R2, I2>,
    φ: EffectAlgebra<F, B, E1, R1, E2, R2, I2>,
  ) =>
    flow(
      cataE(F)((fab: Kind<F, I2, R2, E2, [A, B]>) =>
        pipe(
          fab,
          traverseCovariant(F).map(TU.getSecond),
          φ,
          pipe(fab, f, pairWithFirst, Effect.map<B, [A, B]>),
        ),
      ),
      Effect.map(TU.getFirst),
    )

export const histoE: HistomorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E1 = unknown, R1 = unknown, E2 = unknown, R2 = unknown, I2 = never>(
    φ: EffectCVAlgebra<F, A, E1, R1, E2, R2, I2>,
  ) => {
    const run = (
      fixed: Fix<F, E2, R2, I2>,
    ): Effect.Effect<Cofree<F, A, E2, R2, I2>, E1, R1> =>
      pipe(
        fixed,
        unfix<F, E2, R2, I2>,
        traverseSuspended(F)(run),
        Effect.flatMap(fa => pipe(fa, φ, Effect.map(pairWithSecond(fa)))),
      )

    return flow(run, Effect.map(extract))
  }

export const cata: Catamorphism = F => φ =>
  flow(pipe(φ, succeedBy, cataE(F)), Effect.runSync)

export const para: Paramorphism = F => φ =>
  flow(pipe(φ, succeedBy, paraE(F)), Effect.runSync)

export const zygo: Zygomorphism = F => (f, φ) =>
  flow(zygoE(F)(f, succeedBy(φ)), Effect.runSync)

export const histo: Histomorphism = F => φ =>
  flow(pipe(φ, succeedBy, histoE(F)), Effect.runSync)

export const algebraToCVAlgebra =
  <F extends TypeLambda>(F: Traversable.Traversable<F>) =>
  <A, E, R, I>(alg: Algebra<F, A, E, R, I>): CVAlgebra<F, A, E, R, I> =>
    flow(traverseCovariant(F).map(extract), alg)
