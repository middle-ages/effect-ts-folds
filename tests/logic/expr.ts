import {flow} from 'effect'
import {Fix, fix as fixOf} from 'effect-ts-folds'
import {
  conjunctionF,
  disjunctionF,
  ExprFLambda,
  FalseF,
  negationF,
  TrueF,
} from './exprF.js'

export type Expr = Fix<ExprFLambda>

const fix = fixOf<ExprFLambda>

export const [True, False]: [Expr, Expr] = [fix(TrueF), fix(FalseF)]

export const negation = (value: Expr): Expr => fix(negationF(value)),
  conjunction: (left: Expr, right: Expr) => Expr = flow(conjunctionF, fix),
  disjunction: typeof conjunction = flow(disjunctionF, fix)

export const implies: typeof conjunction = (left, right) =>
  disjunction(conjunction(left, right), negation(left))

export const xor: typeof conjunction = (left, right) =>
  disjunction(
    conjunction(left, negation(right)),
    conjunction(negation(left), right),
  )
