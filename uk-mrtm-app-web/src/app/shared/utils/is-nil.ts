/**
 * Checks if the given value is `null` or `undefined`.
 *
 * This utility function evaluates whether the provided value is either
 * `null` or `undefined` by using loose equality comparison.
 */
export const isNil = (value: any): boolean => {
  return value == null;
};
