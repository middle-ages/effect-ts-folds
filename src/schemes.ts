import {FlatMap as FL, Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe} from 'effect'
import {traverseSuspended} from './util.js'

import {TypeLambda} from 'effect/HKT'
import {fix, unfix} from './fix.js'
import {Algebra, EffectAlgebra} from './types/fold.js'
import {
  Anamorphism,
  AnamorphismE,
  Catamorphism,
  CatamorphismE,
  Hylomorphism,
  HylomorphismE,
} from './types/schemes.js'
import {Coalgebra, EffectCoalgebra} from './types/unfold.js'

export const hylo: Hylomorphism =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: Coalgebra<F, In1, Out2, Out1, A>,
    φ: Algebra<F, In1, Out2, Out1, B>,
  ) => {
    const run: (a: A) => EF.Effect<B> = a =>
      pipe(a, ψ, traverseSuspended(F)<A, B>(run), EF.map(φ))

    return flow(run, EF.runSync)
  }

export const [cata, ana]: [Catamorphism, Anamorphism] = [
  F => φ => hylo(F)(unfix, φ),
  F => ψ => hylo(F)(ψ, fix),
]

export const hyloE: HylomorphismE =
  <F extends TypeLambda>(F: TA.Traversable<F> & FL.FlatMap<F>) =>
  <A, B, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: EffectCoalgebra<F, R, E, A, In1, Out2, Out1>,
    φ: EffectAlgebra<F, R, E, B, In1, Out2, Out1>,
  ) => {
    const traverse = traverseSuspended(F)

    const run: (a: A) => EF.Effect<B, E, R> = a =>
      pipe(a, ψ, EF.flatMap(traverse(run)), EF.flatMap(φ))

    return run
  }

export const [cataE, anaE]: [CatamorphismE, AnamorphismE] = [
  F => φ => hyloE(F)(flow(unfix, EF.succeed), φ),
  F => ψ => hyloE(F)(ψ, flow(fix, EF.succeed)),
]
/*
export const para: Paramorphism =
  <F extends TypeLambda>(F: Covariant<F> & Traversable<F>) =>
  <T, A>(φ: RAlgebra<F, T, A>) =>
    flow(
      hylo(F)(unfix<F, T>, TU.fanout(flow(F.map(TU.getFirst), fix), φ)),
      TU.getSecond,
    )

export const apo: Apomorphism =
  <F extends TypeLambda>(F: Covariant<F> & Traversable<F>) =>
  <T, A>(ψ: RCoalgebra<F, T, A>) => {
    const run = (a: A): Effect<Fix<F, T>> =>
      pipe(a, ψ, EF.delayEffect(F)(TU.fanin(EF.succeed, run)), EF.map(fix))

    return flow(run, EF.runSync)
  }


export const apomorphism2 =
  <F extends TypeLambda>(F: Covariant<F> & Traversable<F>) =>
  <T, A>(ψ: RCoalgebra<F, T, A>) => {
    type Ei = Either<A, Fix<F, T>>
    type K2Ei = Kind2<F, T, Ei>
    type K2 = Kind2<F, T, Ei>
    const bar: Unary<K2, K2Ei> = F.map(EI.right)
    const fanin = TU.fanin(F.map(flow(EI.right, fixWith<F>())), ψ)
  }

const z = compose()

*/
