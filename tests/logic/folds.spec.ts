import {Array as AR, pipe} from 'effect'
import {zipFolds} from 'effect-ts-folds'
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
import {
  count,
  countTrue,
  evaluate,
  maxDepth,
  nodes,
  paths,
  show,
  showExpr,
  values,
} from './folds.js'
import {exprCata, exprCovariant, testCata, testCatas} from './helpers.js'
import {showTree} from './showTree.js'

describe('folds', () => {
  describe('show', () => {
    ;(
      [
        ['⊤', True, '⊤'],
        ['⊥', False, '⊥'],
        ['⊤ ⊻ ⊥', xor(True, False), '((⊤ ∧ ¬⊥) ∨ (¬⊤ ∧ ⊥))'],
      ] as const
    ).forEach(([name, expr, expected]) => {
      it(`${name} → “${expected}”`, () => {
        testCata(show)(expr, expected)
      })
    })
  })

  testCatas('evaluate', evaluate)(
    [True, true],
    [False, false],
    [negation(False), true],
    [conjunction(True, True), true],
    [conjunction(True, False), false],
    [disjunction(True, True), true],
    [disjunction(True, False), true],
    [xor(True, True), false],
    [xor(True, False), true],
    [implies(True, True), true],
    [implies(False, True), true],
    [implies(False, False), true],
    [implies(True, False), false],
    [implies(True, False), false],
  )

  testCatas('countTrue', countTrue)(
    [True, 1],
    [False, 0],
    [conjunction(True, negation(False)), 1],
    [xor(True, False), 2],
  )

  testCatas('maxDepth', maxDepth)(
    [True, 1],
    [False, 1],
    [conjunction(True, negation(False)), 3],
    [xor(True, False), 4],
    [conjunction(True, xor(True, False)), 5],
  )

  testCatas('values', values, 'toEqual')(
    [True, [true]],
    [False, [false]],
    [conjunction(True, negation(False)), [true, false]],
    [xor(negation(False), negation(True)), [false, true, false, true]],
  )

  testCatas('paths', paths, 'toEqual')(
    [True, [['⊤']]],
    [False, [['⊥']]],
    [negation(False), [['¬', '⊥']]],
    [
      xor(True, False),
      [
        ['∨', '∧', '⊤'],
        ['∨', '∧', '¬', '⊥'],
        ['∨', '∧', '¬', '⊤'],
        ['∨', '∧', '⊥'],
      ],
    ],
  )
  /* The xor tree   pre-order      in-order      post-order
        ─┬∨             9              5              1
         ├─┬∧           4              4              2
         │ ├──⊤         1              1              3
         │ └─┬¬         3              3              4
         │   └──⊥       2              2              5
         └─┬∧           8              8              6
           ├─┬¬         6              7              7
           │ └──⊤       5              6              8
           └──⊥         7              9              9

*/
  testCatas('preOrder', nodes('pre'), 'toEqual')(
    [False, ['⊥']],
    [negation(False), ['⊥', '¬']],
    [xor(True, False), ['⊤', '⊥', '¬', '∧', '⊤', '¬', '⊥', '∧', '∨']],
  )

  testCatas('inOrder', nodes('in'), 'toEqual')(
    [False, ['⊥']],
    [negation(False), ['⊥', '¬']],
    [xor(True, False), ['⊤', '∧', '⊥', '¬', '∨', '⊤', '¬', '∧', '⊥']],
  )

  testCatas('postOrder', nodes('post'), 'toEqual')(
    [False, ['⊥']],
    [negation(False), ['¬', '⊥']],
    [xor(True, False), ['∨', '∧', '⊤', '¬', '⊥', '∧', '¬', '⊤', '⊥']],
  )

  /*
  test('negateValues', () => {
    expect(showExpr(exprCata(negateValues)(xor(True, False)))).toBe('(¬⊤ ∨ ¬⊥)')
  })
    */

  testCatas(
    'show, count, and evaluate',
    zipFolds(exprCovariant)(show, evaluate, count),
    'toEqual',
  )(
    [True, ['⊤', true, 1]],
    [False, ['⊥', false, 1]],
    [negation(False), ['¬⊥', true, 2]],
    [conjunction(True, True), ['(⊤ ∧ ⊤)', true, 3]],
    [xor(True, False), ['((⊤ ∧ ¬⊥) ∨ (¬⊤ ∧ ⊥))', true, 9]],
  )

  describe('showTree', () => {
    const testTree = (expr: Expr, expected: string) => {
      const tree = (expr: Expr): string =>
        '\n' + pipe(expr, exprCata(showTree), AR.join('\n'))
      test(showExpr(expr), () => {
        expect(tree(expr)).toBe(expected)
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
      xor(True, False),
      `
─┬∨
 ├─┬∧
 │ ├──⊤
 │ └─┬¬
 │   └──⊥
 └─┬∧
   ├─┬¬
   │ └──⊤
   └──⊥`,
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
