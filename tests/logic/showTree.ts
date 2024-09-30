import {Array as AR, pipe, String as STR} from 'effect'
import {Algebra} from 'effect-ts-folds'
import {ExprFLambda, matchF} from './exprF.js'
import {showOp} from './folds.js'

const nSpaces = (n: number) => STR.repeat(n)(' ')
const prefix = (prefix: string) => (suffix: string) => `${prefix}${suffix}`

const [leaf, branch, elbow, rightT, vertical, space] = [
  prefix('──'),
  prefix('─┬'),
  prefix(' └'),
  prefix(' ├'),
  prefix(' │'),
  prefix('  '),
]

const binOp =
  (op: string) =>
  (
    [headLeft, ...tailLeft]: AR.NonEmptyArray<string>,
    [headRight, ...tailRight]: AR.NonEmptyArray<string>,
  ): AR.NonEmptyArray<string> => {
    const head = Math.max(headLeft.length, headRight.length)

    return [
      branch(op),

      rightT(headLeft + nSpaces(head - headLeft.length)),
      ...pipe(tailLeft, AR.map(vertical)),

      elbow(headRight + nSpaces(head - headRight.length)),
      ...pipe(tailRight, AR.map(pipe(head - 1, nSpaces, prefix))),
    ]
  }

export const showTree: Algebra<ExprFLambda, AR.NonEmptyArray<string>> = matchF(
  value => pipe(value ? '⊤' : '⊥', leaf, AR.of),
  ([head, ...tail]) => [branch('¬'), elbow(head), ...pipe(tail, AR.map(space))],
  isAnd => pipe(isAnd, showOp, binOp),
)
