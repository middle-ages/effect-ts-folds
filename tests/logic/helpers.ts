import {Covariant as CO} from '@effect/typeclass'
import {Algebra, cata, para, zygo} from 'effect-ts-folds'
import {traverseCovariant} from '../../src/traversable.js'
import {Expr} from './expr.js'
import {ExprFLambda, Traversable} from './exprF.js'
import {showExpr} from './folds.js'

export const exprCovariant: CO.Covariant<ExprFLambda> =
  traverseCovariant<ExprFLambda>(Traversable)

export const [exprCata, exprPara, exprZygo] = [
  cata(Traversable),
  para(Traversable),
  zygo(Traversable),
]

export const testCata =
  <A>(fold: Algebra<ExprFLambda, A>, assertion?: 'toBe' | 'toEqual') =>
  (expr: Expr, expected: A) => {
    expect(exprCata(fold)(expr))[assertion ?? 'toBe'](expected)
  }

export const testCatas =
  <A>(
    name: string,
    fold: Algebra<ExprFLambda, A>,
    assertion?: 'toBe' | 'toEqual',
  ) =>
  (...cases: [Expr, A][]) => {
    describe(name, () => {
      for (const [expr, expected] of cases) {
        it(showExpr(expr), () => {
          testCata(fold, assertion)(expr, expected)
        })
      }
    })
  }
