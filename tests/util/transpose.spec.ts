import {transpose} from 'effect-ts-folds'

describe('transpose', () => {
  describe('squares', () => {
    test('1×1', () => {
      expect(transpose([[42]])).toEqual([[42]])
    })

    test('2×2', () => {
      expect(
        transpose([
          ['a', 'b'],
          ['c', 'd'],
        ]),
      ).toEqual([
        ['a', 'c'],
        ['b', 'd'],
      ])
    })

    test('3×3', () => {
      expect(
        transpose([
          ['a', 'b', 'c'],
          ['d', 'e', 'f'],
          ['g', 'h', 'i'],
        ]),
      ).toEqual([
        ['a', 'd', 'g'],
        ['b', 'e', 'h'],
        ['c', 'f', 'i'],
      ])
    })
  })

  describe('rectangular', () => {
    test('1×2', () => {
      expect(transpose([[42, 43]])).toEqual([[42], [43]])
    })

    test('3×2', () => {
      expect(
        transpose([
          [1, 2],
          [3, 4],
          [5, 6],
        ]),
      ).toEqual([
        [1, 3, 5],
        [2, 4, 6],
      ])
    })

    test('3×4', () => {
      expect(
        transpose([
          [1, 2, 3, 4],
          [5, 6, 7, 8],
        ]),
      ).toEqual([
        [1, 5],
        [2, 6],
        [3, 7],
        [4, 8],
      ])
    })
  })

  describe('jagged', () => {
    test('first is short', () => {
      expect(
        transpose([
          [1, 2],
          [3, 4, 5],
        ]),
      ).toEqual([[1, 3], [2, 4], [5]])
    })

    test('second is short', () => {
      expect(
        transpose([
          [1, 2, 3],
          [4, 5],
        ]),
      ).toEqual([[1, 4], [2, 5], [3]])
    })
  })
})
