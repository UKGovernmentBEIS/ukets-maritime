/**
 * Checks if a given value is considered empty.
 *
 * A value is considered empty if it meets any of the following criteria:
 * - It is `null` or `undefined`.
 * - It is a string or an array with a length of 0.
 * - It is an object with no enumerable keys.
 * - It is a `Set` or `Map` with a size of 0.
 *
 */
export const isEmpty = (value: any) => {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return !value.length;
  }

  if (typeof value === 'object') {
    return !Object.keys(value)?.length;
  }

  if (value instanceof Set || value instanceof Map) {
    return !value.size;
  }

  return true;
};
