import {Array as AR, Effect as EF, pipe} from 'effect'
import {Cons, cons, empty, of, toArray} from './cons.js'
import {ConsF} from './consF.js'
import {
  consCataE,
  consParaE,
  countCataE,
  countE,
  countRangeE,
  rangeAnaE,
  tailsUntilZero,
} from './effect.js'
import {
  alternateSum,
  consAna,
  consApo,
  consPara,
  consZygo,
  countCata,
  countRange,
  flip,
  halves,
  rangeAna,
  tails,
  takeUntil,
  unfoldUntil,
} from './schemes.js'

describe('consList', () => {
  test('from/toArray', () => {
    expect(pipe([1, 2, 3], cons, toArray)).toEqual([1, 2, 3])
  })

  describe('schemes', () => {
    describe('cata/ana/hylo/cataE/anaE/hyloE', () => {
      describe.each`
        name     | cons            | n
        ${'∅'}   | ${empty}        | ${0}
        ${'1'}   | ${of(1)}        | ${1}
        ${'1,2'} | ${cons([2, 1])} | ${2}
      `('$name', ({cons, n}: {cons: Cons; n: number}) => {
        test('cata', () => {
          expect(countCata(cons)).toBe(n)
        })
        test('ana', () => {
          expect(rangeAna(n)).toEqual(cons)
        })
        test('hylo', () => {
          expect(countRange(n)).toEqual(n)
        })
        test('cataE', () => {
          expect(pipe(cons, countCataE, EF.runSync)).toBe(n)
        })
        test('anaE', () => {
          expect(pipe(n, rangeAnaE, EF.runSync)).toEqual(cons)
        })
        test('hyloE', () => {
          expect(pipe(n, countRangeE, EF.runSync)).toEqual(n)
        })

        test('halves unfold', () => {
          expect(pipe(64, consAna(halves), toArray)).toEqual([
            64, 32, 16, 8, 4, 2, 1,
          ])
        })
      })

      test('zygo', () => {
        expect(
          pipe([1, 2, 3, 4, 5], cons, consZygo(alternateSum, flip)),
        ).toEqual(1 - 2 + 3 - 4 + 5)
      })

      describe('cataE with errors', () => {
        test('1,2,3 cata error passthrough', () => {
          assert.throws(
            () => pipe([1, 2, 3], cons, countCataE, EF.runSync),
            /no more cata/,
          )
        })

        test('cata error short-circuits', () => {
          let counter = 0
          const foldE = consCataE((fa: ConsF<number>) => {
            counter++
            return countE(fa)
          })

          try {
            pipe(AR.range(1, 20_000), cons, foldE, EF.runSync)
          } catch (e) {
            expect((e as Error).message).match(/no more cata/)
          }

          expect(counter).toBe(4)
        })
      })

      describe('hyloE', () => {
        test('cata fails first', () => {
          assert.throws(() => pipe(3, countRangeE, EF.runSync), /no more cata/)
        })

        test('ana fails first', () => {
          assert.throws(() => pipe(4, countRangeE, EF.runSync), /no more ana/)
        })
      })

      test('para', () => {
        expect(pipe([1, 2, 3, 4], cons, consPara(tails))).toEqual([
          cons([1, 2, 3, 4]),
          cons([2, 3, 4]),
          cons([3, 4]),
          cons([4]),
        ])
      })

      test('paraE', () => {
        assert.throws(() => {
          pipe([1, 2, 0, 3, 4], cons, consParaE(tailsUntilZero), EF.runSync)
        }, /got zero/)
      })

      describe('apo', () => {
        test('not found', () => {
          expect(pipe([4, cons([1, 2, 3])], takeUntil)).toEqual(cons([1, 2, 3]))
        })

        test('found first', () => {
          expect(pipe([1, cons([1, 2, 3])], takeUntil)).toEqual(cons([1]))
        })

        test('found middle', () => {
          expect(pipe([3, cons([1, 2, 3, 4, 5, 6, 7, 8])], takeUntil)).toEqual(
            cons([1, 2, 3]),
          )
        })

        test('short-circuits on find', () => {
          const spy = vi.fn().mockImplementation(unfoldUntil)
          pipe([3, cons([1, 2, 3, 4, 5, 6, 7, 8])], consApo(spy))
          expect(spy.mock.calls.length).toBe(3)
        })
      })
    })
  })
})
