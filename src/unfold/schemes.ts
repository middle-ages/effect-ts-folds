import {Effect as EF, flow, pipe} from 'effect'
import {traverseSuspended} from '../cont.js'
import {fix} from '../fix.js'
import {fanin} from '../pair.js'
import {hylo, hyloE} from '../refold/schemes.js'
import {AnamorphismE, ApomorphismE} from './effect.js'
import {Anamorphism, Apomorphism} from './unfolds.js'

export const ana: Anamorphism = F => ψ => hylo(F)(ψ, fix)

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

export const apo: Apomorphism = F => ψ => a =>
  pipe(a, apoE(F)(flow(ψ, EF.succeed)), EF.runSync)
