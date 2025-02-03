import {Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, fix, unfix} from '../fix.js'
import {hyloE} from '../refold/schemes.js'
import {fanout, pairWithFirst, traverseCovariant} from '../util.js'
import {
  CatamorphismE,
  EffectAlgebra,
  EffectRAlgebra,
  ParamorphismE,
  ZygomorphismE,
} from './effect.js'
import {Catamorphism, DistLeft, Paramorphism, Zygomorphism} from './folds.js'

export const cataE: CatamorphismE = F => φ =>
  hyloE(F)(a => pipe(a, unfix, EF.succeed), φ)

export const paraE: ParamorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E1 = unknown, R1 = never, E2 = unknown, R2 = never>(
    φ: EffectRAlgebra<F, A, E1, R1, E2, R2>,
  ) =>
  (fixed: Fix<F, E2, R2>) =>
    pipe(
      fixed,
      cataE(F)((fa: Kind<F, R2, unknown, E2, [typeof fixed, A]>) => {
        const [fixed, effect] = pipe(
          fa,
          fanout(fa => pipe(fa, traverseCovariant(F).map(TU.getFirst), fix), φ),
        )
        return pipe(effect, EF.map(pairWithFirst(fixed)))
      }),
      EF.map(TU.getSecond),
    )

export const zygoE: ZygomorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, E1 = unknown, R1 = never, E2 = unknown, R2 = never>(
    f: DistLeft<F, A, B, E2, R2>,
    φ: EffectAlgebra<F, B, E1, R1, E2, R2>,
  ) =>
    flow(
      cataE(F)((fab: Kind<F, R2, unknown, E2, [A, B]>) =>
        pipe(
          fab,
          traverseCovariant(F).map(TU.getSecond),
          φ,
          EF.map(pairWithFirst(f(fab))),
        ),
      ),
      EF.map(TU.getFirst),
    )

export const cata: Catamorphism = F => φ => fixed =>
  pipe(fixed, cataE(F)(flow(φ, EF.succeed)), EF.runSync)

export const para: Paramorphism = F => φ => fixed =>
  pipe(fixed, paraE(F)(flow(φ, EF.succeed)), EF.runSync)

export const zygo: Zygomorphism = F => (f, φ) => fixed =>
  pipe(fixed, zygoE(F)(f, flow(φ, EF.succeed)), EF.runSync)
