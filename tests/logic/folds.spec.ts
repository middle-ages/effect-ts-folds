import {Array as AR, pipe} from 'effect'
import {Algebra, cata, zipFolds} from 'effect-ts-folds'
import {
  conjunction,
  disjunction,
  Expr,
  False,
  implies,
  negation,
  True,
  xor,
} from './expr.js'
import {ExprFLambda, instances} from './exprF.js'
import {
  countAlgebra,
  evalAlgebra,
  evaluate,
  show,
  showAlgebra,
  valuesAlgebra,
} from './schemes.js'
import {showTreeAlgebra} from './showTree.js'

describe('folds', () => {
  describe('show', () => {
    const cases: [string, Expr, string][] = [
      ['⊤', True, '⊤'],
      ['⊥', False, '⊥'],
      ['⊤ ⊻ ⊥', xor(True, False), '((⊤ ∧ ¬⊥) ∨ (¬⊤ ∧ ⊥))'],
    ]

    for (const [name, expr, expected] of cases) {
      it(`${name} → “${expected}”`, () => {
        expect(show(expr)).toBe(expected)
      })
    }
  })

  describe('evaluate', () => {
    const cases: [string, Expr, boolean][] = [
      ['⊤ = ⊤', True, true],
      ['⊥ = ⊥', False, false],
      ['¬⊥ = ⊤', negation(False), true],
      ['⊤ ∧ ⊤ = ⊤', conjunction(True, True), true],
      ['⊤ ∧ ⊥ = ⊤', conjunction(True, False), false],
      ['⊤ ∨ ⊤ = ⊤', disjunction(True, True), true],
      ['⊤ ∨ ⊥ = ⊤', disjunction(True, False), true],
      ['⊤ ⊻ ⊤ = ⊤', xor(True, True), false],
      ['⊤ ⊻ ⊥ = ⊤', xor(True, False), true],
      ['⊤ ⇒ ⊤ = ⊤', implies(True, True), true],
      ['⊥ ⇒ ⊤ = ⊤', implies(False, True), true],
      ['⊥ ⇒ ⊥ = ⊤', implies(False, False), true],
      ['⊤ ⇒ ⊥ = ⊤', implies(True, False), false],
      ['⊤ ⇒ ⊥ = ⊤', implies(True, False), false],
    ]

    for (const [name, expr, expected] of cases) {
      it(name, () => {
        expect(evaluate(expr)).toBe(expected)
      })
    }
  })

  describe('values', () => {
    const cases: [Expr, AR.NonEmptyArray<boolean>][] = [
      [True, [true]],
      [False, [false]],
      [conjunction(True, negation(False)), [true, false]],
      [xor(negation(False), negation(True)), [false, true, false, true]],
    ]

    const values = cata(instances)(valuesAlgebra)

    for (const [expr, expected] of cases) {
      it(show(expr), () => {
        expect(values(expr)).toEqual(expected)
      })
    }
  })

  describe('show, count, and evaluate', () => {
    const cases: [Expr, [string, boolean, number]][] = [
      [True, ['⊤', true, 1]],
      [False, ['⊥', false, 1]],
      [negation(False), ['¬⊥', true, 2]],
      [conjunction(True, True), ['(⊤ ∧ ⊤)', true, 3]],
      [xor(True, False), ['((⊤ ∧ ¬⊥) ∨ (¬⊤ ∧ ⊥))', true, 9]],
    ]

    const algebra: Algebra<ExprFLambda, [string, boolean, number]> = zipFolds(
      instances,
    )(showAlgebra, evalAlgebra, countAlgebra)

    for (const [expr, expected] of cases) {
      it(show(expr), () => {
        expect(cata(instances)(algebra)(expr)).toEqual(expected)
      })
    }
  })

  describe('showTree', () => {
    const showTree = (expr: Expr): string =>
      '\n' + pipe(expr, cata(instances)(showTreeAlgebra), AR.join('\n'))

    const testTree = (expr: Expr, expected: string) => {
      test(show(expr), () => {
        expect(showTree(expr)).toBe(expected)
      })
    }

    testTree(
      True,
      `
──⊤`,
    )

    testTree(
      False,
      `
──⊥`,
    )

    testTree(
      negation(True),
      `
─┬¬
 └──⊤`,
    )

    testTree(
      conjunction(True, False),
      `
─┬∧
 ├──⊤
 └──⊥`,
    )

    testTree(
      disjunction(False, True),
      `
─┬∨
 ├──⊥
 └──⊤`,
    )

    testTree(
      xor(True, True),
      `
─┬∨
 ├─┬∧
 │ ├──⊤
 │ └─┬¬
 │   └──⊤
 └─┬∧
   ├─┬¬
   │ └──⊤
   └──⊤`,
    )

    testTree(
      xor(xor(conjunction(True, False), True), xor(True, negation(False))),
      `
─┬∨
 ├─┬∧
 │ ├─┬∨
 │ │ ├─┬∧
 │ │ │ ├─┬∧
 │ │ │ │ ├──⊤
 │ │ │ │ └──⊥
 │ │ │ └─┬¬
 │ │ │   └──⊤
 │ │ └─┬∧
 │ │   ├─┬¬
 │ │   │ └─┬∧
 │ │   │   ├──⊤
 │ │   │   └──⊥
 │ │   └──⊤
 │ └─┬¬
 │   └─┬∨
 │     ├─┬∧
 │     │ ├──⊤
 │     │ └─┬¬
 │     │   └─┬¬
 │     │     └──⊥
 │     └─┬∧
 │       ├─┬¬
 │       │ └──⊤
 │       └─┬¬
 │         └──⊥
 └─┬∧
   ├─┬¬
   │ └─┬∨
   │   ├─┬∧
   │   │ ├─┬∧
   │   │ │ ├──⊤
   │   │ │ └──⊥
   │   │ └─┬¬
   │   │   └──⊤
   │   └─┬∧
   │     ├─┬¬
   │     │ └─┬∧
   │     │   ├──⊤
   │     │   └──⊥
   │     └──⊤
   └─┬∨
     ├─┬∧
     │ ├──⊤
     │ └─┬¬
     │   └─┬¬
     │     └──⊥
     └─┬∧
       ├─┬¬
       │ └──⊤
       └─┬¬
         └──⊥`,
    )
  })
})
