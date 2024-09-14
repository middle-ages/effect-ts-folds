import {Array as AR, pipe} from 'effect'
import {fix, RAlgebra} from 'effect-ts-folds'
import {Cons, cons, toArray} from './cons.js'
import {ConsFLambda, match} from './consF.js'
import {consPara, countCata, rangeAna, takeUntil} from './schemes.js'

const FRAMES = 20_000
const deep = cons(AR.range(1, FRAMES))

describe('consList schemes are stack-safe', () => {
  test('cata', () => {
    expect(countCata(deep)).toBe(FRAMES)
  })

  test('ana', () => {
    expect(pipe(FRAMES, rangeAna, toArray, AR.length)).toBe(FRAMES)
  })

  test('para', () => {
    const rAlgebra: RAlgebra<ConsFLambda, Cons[]> = match(
      () => [],
      ([first, [second]], head) => [
        fix([first, head]),
        ...(second === undefined ? [] : [second]),
      ],
    )

    assert.doesNotThrow(() => pipe(deep, consPara(rAlgebra), AR.map(toArray)))
  })

  test('apo', () => {
    const actual = takeUntil([-1, deep])
    expect(toArray(actual)).toEqual(AR.range(1, FRAMES))
  })
})
