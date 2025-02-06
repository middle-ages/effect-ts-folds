import {Array as AR, flow, Number as NU, Option as OP, pipe} from 'effect'

/** Transpose a list of arrays. */
export const transpose = <A>([head, ...tail]: A[][]): A[][] =>
  head === undefined
    ? []
    : !AR.isNonEmptyArray(tail)
      ? pipe(head, AR.map(AR.of))
      : pipe([head, ...tail], padSuffix, transposePadded, AR.map(AR.getSomes))

const padSuffix = <A>(xss: A[][]): OP.Option<A>[][] => {
  const n = pipe([0, ...AR.map(xss, AR.length)], AR.max(NU.Order)) - 1
  const f = (xs: OP.Option<A>[]) =>
    n <= 1
      ? xs
      : [
          ...xs,
          ...(n === xs.length - 1
            ? []
            : AR.replicate(OP.none(), n - xs.length)),
        ]

  return pipe(xss, AR.map(flow(AR.map(OP.some), f)))
}

const transposePadded = <A>([first, second, ...rest]: A[][]): A[][] =>
  first === undefined
    ? []
    : second === undefined
      ? pipe(first, AR.map(AR.of))
      : pipe(
          rest,
          AR.reduce(AR.zip(first, second), (p: A[][], c: A[]) =>
            AR.zipWith(p, c, AR.append<A, A>),
          ),
        )
