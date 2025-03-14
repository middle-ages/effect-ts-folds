import {flow} from 'effect'
import {cata} from '../fold/schemes.js'
import {ana} from '../unfold/schemes.js'
import {Hylomorphism} from './refolds.js'

export const cataAnaBasedHylo: Hylomorphism = F => (ψ, φ) =>
  flow(ana(F)(ψ), cata(F)(φ))
