import {FlatMap as FL, Traversable as TA} from '@effect/typeclass'
import {Effect as EF} from 'effect'
import {TypeLambda} from 'effect/HKT'
import {Fix} from '../fix.js'
import {Algebra, EffectAlgebra} from './fold.js'
import {Coalgebra, EffectCoalgebra} from './unfold.js'

export interface Catamorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <In1, Out2, Out1, A>(
    φ: Algebra<F, In1, Out2, Out1, A>,
  ) => (fixed: Fix<F, In1, Out2, Out1>) => A
}

export interface Anamorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <In1, Out2, Out1, A>(
    ψ: Coalgebra<F, In1, Out2, Out1, A>,
  ) => (a: A) => Fix<F, In1, Out2, Out1>
}

export interface Hylomorphism {
  <F extends TypeLambda>(
    F: TA.Traversable<F>,
  ): <In1, Out2, Out1, A, B>(
    ψ: Coalgebra<F, In1, Out2, Out1, A>,
    φ: Algebra<F, In1, Out2, Out1, B>,
  ) => (a: A) => B
}

export interface CatamorphismE {
  <F extends TypeLambda>(
    F: TA.Traversable<F> & FL.FlatMap<F>,
  ): <A, E, R, Out1, Out2, In1>(
    ψ: EffectAlgebra<F, R, E, A, In1, Out2, Out1>,
  ) => (fixed: Fix<F, In1, Out2, Out1>) => EF.Effect<A, E, R>
}

export interface AnamorphismE {
  <F extends TypeLambda>(
    F: TA.Traversable<F> & FL.FlatMap<F>,
  ): <A, E, R, Out1, Out2, In1>(
    ψ: EffectCoalgebra<F, R, E, A, In1, Out2, Out1>,
  ) => (a: A) => EF.Effect<Fix<F, In1, Out2, Out1>, E, R>
}

export interface HylomorphismE {
  <F extends TypeLambda>(
    F: TA.Traversable<F> & FL.FlatMap<F>,
  ): <A, B, E, R, Out1, Out2, In1>(
    ψ: EffectCoalgebra<F, R, E, A, In1, Out2, Out1>,
    φ: EffectAlgebra<F, R, E, B, In1, Out2, Out1>,
  ) => (a: A) => EF.Effect<B, E, R>
}

/*
export interface Paramorphism {
  <F extends TypeLambda>(
    F: Covariant<F> & Traversable<F>,
  ): <T, A>(φ: RAlgebra<F, T, A>) => (fixed: Fix<F, T>) => A
}

export interface Apomorphism {
  <F extends TypeLambda>(
    F: Covariant<F> & Traversable<F>,
  ): <T, A>(ψ: RCoalgebra<F, T, A>) => (a: A) => Fix<F, T>
}


*/
