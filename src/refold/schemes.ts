import {succeedBy, traverseSuspended} from '#util'
import {Effect as EF, pipe} from 'effect'
import {Hylomorphism, HylomorphismE} from './refolds.js'

export const hyloE: HylomorphismE = F => (ψ, φ) => a =>
  pipe(a, ψ, EF.flatMap(traverseSuspended(F)(hyloE(F)(ψ, φ))), EF.flatMap(φ))

export const hylo: Hylomorphism = F => (ψ, φ) => a =>
  pipe(a, hyloE(F)(succeedBy(ψ), succeedBy(φ)), EF.runSync)
