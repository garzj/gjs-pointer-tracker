export function exhausted(_: never): never {
  throw new Error('Exhaustive check failed.');
}
