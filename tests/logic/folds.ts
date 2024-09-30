import {Array as AR, identity, Number as NU, pipe} from 'effect'
import {Algebra, cata, fix, Unfixed} from 'effect-ts-folds'
import {constant} from 'effect/Function'
import {Expr} from './expr.js'
import {
  $match,
  And,
  ExprFLambda,
  FalseF,
  matchF,
  negationF,
  Or,
  Traversable,
  TrueF,
} from './exprF.js'

export const fixExpr = fix<ExprFLambda>

export const showValue = (value: boolean) => (value ? '⊤' : '⊥'),
  showOp = (isAnd: boolean) => (isAnd ? '∧' : '∨')

export const show: Algebra<ExprFLambda, string> = matchF(
  showValue,
  value => `¬${value}`,
  isAnd => (left, right) => `(${left} ${showOp(isAnd)} ${right})`,
)

export const showExpr = cata(Traversable)(show)

export const evaluate: Algebra<ExprFLambda, boolean> = $match({
  Value: ({value}) => value,
  Not: ({value}) => !value,
  And: ({left, right}) => left && right,
  Or: ({left, right}) => left || right,
})

export const count: Algebra<ExprFLambda, number> = matchF(
  constant(1),
  NU.increment,
  () => (left, right) => left + right + 1,
)

export const countTrue: Algebra<ExprFLambda, number> = matchF(
  value => (value ? 1 : 0),
  identity,
  () => (left, right) => left + right,
)

export const maxDepth: Algebra<ExprFLambda, number> = matchF(
  constant(1),
  NU.increment,
  () => (left, right) => Math.max(left, right) + 1,
)

export const values: Algebra<ExprFLambda, AR.NonEmptyArray<boolean>> = matchF(
  AR.of,
  identity,
  () => (left, right) => [...left, ...right],
)

const flipValue = (value: boolean): Unfixed<ExprFLambda> =>
  value ? FalseF : TrueF

export const negateValues: Algebra<ExprFLambda, Expr> = fa =>
  pipe(
    fa,
    $match({
      Value: ({value}) => flipValue(value),
      Not: value => pipe(value, fixExpr, negationF),
      And: And<Expr, Expr>,
      Or: Or<Expr, Expr>,
    }),
    fixExpr,
  )

type Strings = AR.NonEmptyArray<string>
type Strings2 = AR.NonEmptyArray<Strings>

export const paths: Algebra<ExprFLambda, Strings2> = matchF(
  value => pipe(value, showValue, AR.of, AR.of),
  value => pipe(value, AR.map(AR.prepend('¬'))),
  isAnd => (left, right) => {
    const symbol = AR.prepend(showOp(isAnd))
    return [...AR.map(left, symbol), ...AR.map(right, symbol)]
  },
)

export const nodes = (
  traversal: 'pre' | 'in' | 'post',
): Algebra<ExprFLambda, Strings> =>
  matchF(
    value => pipe(value, showValue, AR.of),
    value => pipe(value, AR[traversal === 'post' ? 'prepend' : 'append']('¬')),
    isAnd => (left, right) =>
      traversal === 'pre'
        ? [...left, ...right, showOp(isAnd)]
        : traversal === 'in'
          ? [...left, showOp(isAnd), ...right]
          : [showOp(isAnd), ...left, ...right],
  )
