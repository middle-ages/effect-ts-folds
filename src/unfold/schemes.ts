import {fix} from '#fix'
import {fanin, succeedBy, traverseSuspended} from '#util'
import {Effect as EF, flow, pipe} from 'effect'
import {hylo, hyloE} from '../refold/schemes.js'
import {AnamorphismE, ApomorphismE} from './effect.js'
import {Anamorphism, Apomorphism} from './unfolds.js'

export const anaE: AnamorphismE = F => ψ => hyloE(F)(ψ, flow(fix, EF.succeed))

export const apoE: ApomorphismE = F => ψ => a =>
  pipe(
    a,
    ψ,
    EF.flatMap(
      traverseSuspended(F)(eif => pipe(eif, fanin(EF.succeed, apoE(F)(ψ)))),
    ),
    EF.map(fix),
  )

export const ana: Anamorphism = F => ψ => hylo(F)(ψ, fix)

export const apo: Apomorphism = F => ψ =>
  flow(pipe(ψ, succeedBy, apoE(F)), EF.runSync)
