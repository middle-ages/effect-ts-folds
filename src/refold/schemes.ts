import {Effect as EF, flow, pipe} from 'effect'
import {traverseSuspended} from '../cont.js'
import {Hylomorphism, HylomorphismE} from './refolds.js'

export const hyloE: HylomorphismE = F => (ψ, φ) => a =>
  pipe(a, ψ, EF.flatMap(traverseSuspended(F)(hyloE(F)(ψ, φ))), EF.flatMap(φ))

export const hylo: Hylomorphism = F => (ψ, φ) => a =>
  pipe(a, hyloE(F)(flow(ψ, EF.succeed), flow(φ, EF.succeed)), EF.runSync)
