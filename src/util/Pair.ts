import {Either as EI, flow, Tuple} from 'effect'
/**
 * Run a pair of functions on the same value and return the result tuple.
 * @category pair
 */
export const fanout =
  <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) =>
  (a: A): [B, C] => [ab(a), ac(a)]

/**
 * Convert a pair of functions into a function that runs the first on left and
 * the second on right.
 * @category pair
 */
export const fanin = <A, B, C>(
  ba: (b: B) => A,
  ca: (c: C) => A,
): ((ei: EI.Either<C, B>) => A) => EI.match({onLeft: ba, onRight: ca})

/**
 * Map over both members of a pair with a single function.
 * @category pair
 */
export const pairMap =
  <A, B>(ab: (a: A) => B) =>
  ([a1, a2]: [A, A]): [B, B] => [ab(a1), ab(a2)]

export const pairWithFirst =
  <A>(first: A) =>
  <B>(second: B): [A, B] => [first, second]

export const pairWithSecond =
  <B>(second: B) =>
  <A>(first: A): [A, B] => [first, second]

export const square = <A>(a: A): [A, A] => [a, a]

export const squareMapFirst: <A, B>(f: (a: A) => B) => (o: A) => [B, A] = f =>
  flow(square, Tuple.mapFirst(f))
