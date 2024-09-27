import {
  Applicative as AP,
  Covariant as CO,
  SemiApplicative as SE,
  Traversable as TA,
} from '@effect/typeclass'
import {Data, pipe} from 'effect'
import {dual, flow} from 'effect/Function'
import {Kind, TypeLambda} from 'effect/HKT'
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

export const {$match, Value, Not, And, Or} = Data.taggedEnum<ExprFDefinition>()

export const TrueF: Unfixed<ExprFLambda> = Value({value: true})

export const FalseF: Unfixed<ExprFLambda> = Value({value: false})

export const negationF = <A>(value: A): ExprF<A> => Not({value})

export const disjunctionF = <A>(left: A, right: A): ExprF<A> =>
  Or({left, right})

export const conjunctionF: typeof disjunctionF = (left, right) =>
  And({left, right})

export const matchF =
  <A, R>(
    onValue: (value: boolean) => R,
    onNot: (value: A) => R,
    onAnd: (left: A, right: A) => R,
    onOr: (left: A, right: A) => R,
  ) =>
  (expr: ExprF<A>) =>
    pipe(
      expr,
      $match({
        Value: ({value}) => onValue(value),
        Not: ({value}) => onNot(value),
        And: ({left, right}) => onAnd(left, right),
        Or: ({left, right}) => onOr(left, right),
      }),
    ) as R

export const map: CO.Covariant<ExprFLambda>['map'] = dual(
  2,
  <A, B>(fa: ExprF<A>, f: (a: A) => B) =>
    pipe(
      fa,
      matchF(
        value => Value({value}),
        flow(f, negationF),
        (left, right) => conjunctionF(f(left), f(right)),
        (left, right) => disjunctionF(f(left), f(right)),
      ),
    ),
)

export const sequence =
  <F extends TypeLambda>(F: AP.Applicative<F>) =>
  <A, Out1 = unknown, Out2 = unknown, In1 = never>(
    fa: ExprF<Kind<F, In1, Out2, Out1, A>>,
  ): Kind<F, In1, Out2, Out1, ExprF<A>> =>
    pipe(
      fa,
      matchF(
        value => pipe(Value({value}) as ExprF<A>, F.of),
        F.map(negationF),
        SE.lift2(F)(conjunctionF),
        SE.lift2(F)(disjunctionF),
      ),
    )

export const instances: CO.Covariant<ExprFLambda> &
  TA.Traversable<ExprFLambda> = {
  map,
  imap: CO.imap<ExprFLambda>(map),
  traverse: <F extends TypeLambda>(F: AP.Applicative<F>) =>
    dual(
      2,
      <A, B, Out1 = unknown, Out2 = unknown, In1 = never>(
        expr: ExprF<A>,
        f: (a: A) => Kind<F, In1, Out2, Out1, B>,
      ) => pipe(expr, map(f), sequence(F)),
    ),
}
