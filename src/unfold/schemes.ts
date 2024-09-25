import {Traversable as TA} from '@effect/typeclass'
import {Effect as EF, flow, pipe} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {traverseSuspended} from '../cont.js'
import {Fix, fix} from '../fix.js'
import {fanin} from '../pair.js'
import {hylo, hyloE} from '../refold/schemes.js'
import {
  Coalgebra,
  EffectCoalgebra,
  EffectUnfold,
  RCoalgebra,
  Unfold,
} from './unfolds.js'

export type Anamorphism = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: Coalgebra<F, A, Out1, Out2, In1>,
) => Unfold<F, A, Out1, Out2, In1>

export type AnamorphismE = <F extends TypeLambda>(
  F: TA.Traversable<F>,
) => <A, E = never, R = never, Out1 = unknown, Out2 = unknown, In1 = never>(
  ψ: EffectCoalgebra<F, A, E, R, Out1, Out2, In1>,
) => EffectUnfold<F, A, E, R, Out1, Out2, In1>

export const ana: Anamorphism = F => ψ => hylo(F)(ψ, fix)
export const anaE: AnamorphismE = F => ψ => hyloE(F)(ψ, flow(fix, EF.succeed))

export const apo =
  <F extends TypeLambda>(F: TA.Traversable<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    ψ: RCoalgebra<F, A, Out1, Out2, In1>,
  ): Unfold<F, A, Out1, Out2, In1> => {
    const run = (a: A): EF.Effect<Fix<F, Out1, Out2, In1>> =>
      pipe(a, ψ, traverseSuspended(F)(fanin(EF.succeed, run)), EF.map(fix))

    return flow(run, EF.runSync)
  }
