import {flow, pipe} from 'effect'
import {fix, Fix, unfix} from 'effect-ts-folds'
import {
  conjunctionF,
  disjunctionF,
  ExprFLambda,
  FalseF,
  matchF,
  negationF,
  TrueF,
} from './exprF.js'

export type Expr = Fix<ExprFLambda>

export const True: Expr = fix(TrueF)

export const False: Expr = fix(FalseF)

export const negation = (value: Expr): Expr =>
  fix<ExprFLambda>(negationF(value))

export const conjunction: (left: Expr, right: Expr) => Expr = flow(
  conjunctionF,
  fix<ExprFLambda>,
)
export const disjunction: typeof conjunction = flow(
  disjunctionF,
  fix<ExprFLambda>,
)

export const implies: typeof conjunction = (left, right) =>
  disjunction(conjunction(left, right), negation(left))

export const xor: typeof conjunction = (left, right) =>
  disjunction(
    conjunction(left, negation(right)),
    conjunction(negation(left), right),
  )

export const match =
  <R>(
    onValue: (value: boolean) => R,
    onNot: (value: Expr) => R,
    onAnd: (left: Expr, right: Expr) => R,
    onOr: typeof onAnd,
  ) =>
  (expr: Expr) =>
    pipe(expr, unfix, matchF(onValue, onNot, onAnd, onOr))
