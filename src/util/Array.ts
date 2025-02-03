import {Array as AR, Number as NU, Option as OP, pipe} from 'effect'

/**
 * Get the length of the longest child in a list of lists.
 */
export const longestChildLength = (xs: AR.NonEmptyArray<unknown[]>): number =>
  AR.max(NU.Order)([0, ...pipe(xs, AR.map(AR.length))])

/**
 * Transpose a non-empty list of arrays.
 */
export const transpose = <A>(xss: AR.NonEmptyArray<A[]>) =>
  pipe(
    xss,
    AR.map(AR.map(OP.some)),
    AR.map(padSuffix(OP.none(), longestChildLength(xss) - 1)),
    transposePadded,
    AR.map(AR.getSomes),
  ) as typeof xss

const padSuffix =
  <A>(padding: A, n: number) =>
  (xs: A[]): A[] =>
    n === 0 ? xs : [...xs, ...AR.replicate(padding, n - xs.length + 1)]

const transposePadded = <A>([first, second, ...rest]: AR.NonEmptyArray<
  A[]
>): A[][] => {
  if (second === undefined) return pipe(first, AR.map(AR.of))

  const reducer = (previous: A[][], current: A[]): A[][] =>
    AR.zipWith(previous, current, AR.append<A, A>)

  return pipe(rest, AR.reduce(AR.zip(first, second), reducer))
}
