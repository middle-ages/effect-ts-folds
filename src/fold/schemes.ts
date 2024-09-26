import {Covariant as CO, Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe, Tuple as TU} from 'effect'
import {Kind, TypeLambda} from 'effect/HKT'
import {Fix, fix, unfix} from '../fix.js'
import {fanout, pairWithFirst} from '../pair.js'
import {hyloE} from '../refold/schemes.js'
import {
  CatamorphismE,
  EffectAlgebra,
  EffectRAlgebra,
  ParamorphismE,
  ZygomorphismE,
} from './effect.js'
import {Catamorphism, DistLeft, Paramorphism, Zygomorphism} from './folds.js'

export const cataE: CatamorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: EffectAlgebra<F, A, E, R, Out1, Out2, In1>,
  ) =>
    hyloE(F)((a: Fix<F, Out1, Out2, In1>) => pipe(a, unfix, EF.succeed), φ)

export const paraE: ParamorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    φ: EffectRAlgebra<F, A, E, R, Out1, Out2, In1>,
  ) =>
    flow(
      cataE(F)((fa: Kind<F, In1, Out2, Out1, [Fix<F, Out1, Out2, In1>, A]>) => {
        const [fixed, effect] = pipe(
          fa,
          fanout(flow(F.map(TU.getFirst), fix), φ),
        )
        return pipe(effect, EF.map(pairWithFirst(fixed)))
      }),
      EF.map(TU.getSecond),
    )

export const zygoE: ZygomorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F> & CO.Covariant<F>) =>
  <A, B, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    f: DistLeft<F, A, B, Out1, Out2, In1>,
    φ: EffectAlgebra<F, B, E, R, Out1, Out2, In1>,
  ) =>
    flow(
      cataE(F)((fab: Kind<F, In1, Out2, Out1, [A, B]>) =>
        pipe(fab, F.map(TU.getSecond), φ, EF.map(pairWithFirst(f(fab)))),
      ),
      EF.map(TU.getFirst),
    )

export const cata: Catamorphism = F => φ => fixed =>
  pipe(fixed, cataE(F)(flow(φ, EF.succeed)), EF.runSync)

export const para: Paramorphism = F => φ => fixed =>
  pipe(fixed, paraE(F)(flow(φ, EF.succeed)), EF.runSync)

export const zygo: Zygomorphism = F => (f, φ) => fixed =>
  pipe(fixed, zygoE(F)(f, flow(φ, EF.succeed)), EF.runSync)
