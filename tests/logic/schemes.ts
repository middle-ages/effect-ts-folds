import {
  Array as AR,
  Boolean as BO,
  identity,
  Number as NU,
  Predicate as PR,
} from 'effect'
import {Algebra, cata} from 'effect-ts-folds'
import {constant} from 'effect/Function'
import {Expr} from './expr.js'
import {ExprFLambda, instances, matchF} from './exprF.js'

export const evalAlgebra: Algebra<ExprFLambda, boolean> = matchF(
  identity,
  BO.not,
  BO.and,
  BO.or,
)

export const showAlgebra: Algebra<ExprFLambda, string> = matchF(
  value => (value ? '⊤' : '⊥'),
  value => `¬${value}`,
  (left, right) => `(${left} ∧ ${right})`,
  (left, right) => `(${left} ∨ ${right})`,
)

export const countAlgebra: Algebra<ExprFLambda, number> = matchF(
  constant(1),
  NU.increment,
  (left, right) => left + right + 1,
  (left, right) => left + right + 1,
)

export const valuesAlgebra: Algebra<
  ExprFLambda,
  AR.NonEmptyArray<boolean>
> = matchF(
  AR.of,
  identity,
  (left, right) => [...left, ...right],
  (left, right) => [...left, ...right],
)

export const evaluate: PR.Predicate<Expr> = cata(instances)(evalAlgebra)

export const show: (expr: Expr) => string = cata(instances)(showAlgebra)
