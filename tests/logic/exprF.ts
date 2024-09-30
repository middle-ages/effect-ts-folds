import {
  Applicative as AP,
  SemiApplicative as SE,
  Traversable as TA,
} from '@effect/typeclass'
import {Data, pipe} from 'effect'
import {
  arbitraryMonad as AB,
  LiftArbitrary,
  LiftEquivalence,
} from 'effect-ts-laws'
import {dual, flow} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
import fc from 'fast-check'
import {Unfixed} from '../../src/fix.js'

export type ExprF<A> = Data.TaggedEnum<{
  Value: {value: boolean}
  Not: {value: A}
  And: {left: A; right: A}
  Or: {left: A; right: A}
}>

export interface ExprFLambda extends TypeLambda {
  readonly type: ExprF<this['Target']>
}

export interface ExprFDefinition extends Data.TaggedEnum.WithGenerics<2> {
  readonly taggedEnum: ExprF<this['A']>
}

export const {$is, $match, Value, Not, And, Or} =
  Data.taggedEnum<ExprFDefinition>()

export const TrueF: Unfixed<ExprFLambda> = Value({value: true}),
  FalseF: Unfixed<ExprFLambda> = Value({value: false}),
  negationF = <A>(value: A): ExprF<A> => Not({value}),
  disjunctionF = <A>(left: A, right: A): ExprF<A> => Or({left, right}),
  conjunctionF: typeof disjunctionF = (left, right) => And({left, right})

export const matchF =
  <A, R>(
    onValue: (value: boolean) => R,
    onNot: (value: A) => R,
    onBinary: (isAnd: boolean) => (left: A, right: A) => R,
  ) =>
  (expr: ExprF<A>) =>
    pipe(
      expr,
      $match({
        Value: ({value}) => onValue(value),
        Not: ({value}) => onNot(value),
        And: ({left, right}) => onBinary(true)(left, right),
        Or: ({left, right}) => onBinary(false)(left, right),
      }),
    ) as R

export const Traversable: TA.Traversable<ExprFLambda> = {
  traverse: <F extends TypeLambda>(F: AP.Applicative<F>) =>
    dual(
      2,
      <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
        expr: ExprF<A>,
        f: (a: A) => Kind<F, In1, Out2, Out1, B>,
      ) =>
        pipe(
          expr,
          matchF(
            value => pipe(Value({value}) as ExprF<B>, F.of),
            flow(f, F.map(negationF)),
            isAnd => (left, right) =>
              SE.lift2(F)<B, B, ExprF<B>>(isAnd ? conjunctionF : disjunctionF)(
                f(left),
                f(right),
              ),
          ),
        ),
    ),
}

export const getEquivalence: LiftEquivalence<ExprFLambda> =
  equalsA => (self, that) => {
    if (self._tag !== that._tag) return false
    else if ($is('Value')(self))
      return self.value === (that as typeof self).value
    else if ($is('Not')(self))
      return equalsA(self.value, (that as typeof self).value)
    else {
      const thatAs = that as typeof self
      return (
        equalsA(self.left, thatAs.left) && equalsA(self.right, thatAs.right)
      )
    }
  }

export const getArbitrary =
  <Out1>(): LiftArbitrary<ExprFLambda, never, unknown, Out1> =>
  a =>
    pipe(
      fc.integer({min: 1, max: 3}),
      AB.flatMap(n => {
        switch (n) {
          case 1:
            return fc.constant(TrueF)
          case 2:
            return pipe(a, AB.map(negationF))
          default:
            return pipe(
              fc.tuple(fc.boolean(), a, a),
              AB.map(([isAnd, left, right]) =>
                (isAnd ? conjunctionF : disjunctionF)(left, right),
              ),
            )
        }
      }),
    )
