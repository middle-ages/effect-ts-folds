import {Either as EI} from 'effect'
/**
 * Run a pair of functions on the same value and return the result tuple.
 * @pair
 */
export const fanout =
  <A, B, C>(ab: (a: A) => B, ac: (a: A) => C) =>
  (a: A): [B, C] => [ab(a), ac(a)]

/**
 * Convert a pair of functions into a function that runs the first on left and
 * the second on right.
 * @pair
 */
export const fanin = <A, B, C>(
  ba: (b: B) => A,
  ca: (c: C) => A,
): ((ei: EI.Either<C, B>) => A) => EI.match({onLeft: ba, onRight: ca})

/**
 * Map over both members of a pair with a single function.
 * @pair
 */
export const pairMap =
  <A, B>(ab: (a: A) => B) =>
  ([a1, a2]: [A, A]): [B, B] => [ab(a1), ab(a2)]

/**
 * Duplicate a value to create a pair.
 * @pair
 */
export const dup = <A>(a: A): [A, A] => [a, a]
