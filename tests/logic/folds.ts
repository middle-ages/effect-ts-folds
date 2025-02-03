import {Array as AR, flow, identity, pipe} from 'effect'
import {cata, transpose} from 'effect-ts-folds'
import {and, not, or} from 'effect/Boolean'
import {increment} from 'effect/Number'
import {Expr, fix} from './expr.js'
import {
  $match,
  And,
  ExprAlgebra,
  FalseF,
  matchF,
  negationF,
  Or,
  Traversable,
  TrueF,
} from './exprF.js'

export const showValue = (value: boolean) => (value ? '⊤' : '⊥'),
  showOp = (isAnd: boolean) => (isAnd ? '∧' : '∨')

export const show: ExprAlgebra<string> = matchF(
  showValue,
  value => `¬${value}`,
  isAnd => (left, right) => `(${left} ${showOp(isAnd)} ${right})`,
)

export const showExpr = cata(Traversable)(show)

export const evaluate = matchF(
  identity,
  not,
  isAnd => (left, right) => (isAnd ? and : or)(left, right),
)

export const count = matchF(
  () => 1,
  increment,
  () => (left, right) => left + right + 1,
)

export const maxDepth = matchF(
  () => 1,
  increment,
  () => (left, right) => Math.max(left, right) + 1,
)

export const countTrue = matchF(
  value => (value ? 1 : 0),
  identity<number>,
  () => (left, right) => left + right,
)

export const leaves: ExprAlgebra<AR.NonEmptyArray<boolean>> = matchF(
  AR.of,
  identity,
  () => (left, right) => [...left, ...right],
)

export const negateLeaves: ExprAlgebra<Expr> = fa =>
  pipe(
    fa,
    $match({
      Value: ({value}) => (value ? FalseF : TrueF),
      Not: value => pipe(value, fix, negationF),
      And: And<Expr, Expr>,
      Or: Or<Expr, Expr>,
    }),
    fix,
  )

type Strings = AR.NonEmptyArray<string>
type Strings2 = AR.NonEmptyArray<Strings>

export const nodes = (traversal: 'pre' | 'in' | 'post'): ExprAlgebra<Strings> =>
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

const symbol = (isAnd: boolean) => AR.prepend(showOp(isAnd))

export const levels: ExprAlgebra<Strings2> = matchF(
  flow(showValue, AR.of, AR.of),
  AR.map(AR.prepend('¬')),
  isAnd => (left, right) => [
    ...pipe(left, transpose, AR.map(symbol(isAnd))),
    ...pipe(right, transpose, AR.map(symbol(isAnd))),
  ],
)

export const paths: ExprAlgebra<Strings2> = matchF(
  value => pipe(value, showValue, AR.of, AR.of),
  value => pipe(value, AR.map(AR.prepend('¬'))),
  isAnd => (left, right) => [
    ...AR.map(left, symbol(isAnd)),
    ...AR.map(right, symbol(isAnd)),
  ],
)
