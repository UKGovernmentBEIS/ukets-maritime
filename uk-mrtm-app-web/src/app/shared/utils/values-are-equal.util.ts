/**
 * NOTES:
 * - does not handle Set() and Map()
 * - if both values are NaN, returns the default false
 */

export const valuesAreEqual = (a: any, b: any): boolean => {
  // Handle primitives (string, number, boolean, null, undefined, symbol, bigint)
  if (a === b) {
    return true;
  }

  // If types differ, not equal
  if (typeof a !== typeof b) {
    return false;
  }

  // If both are null, covered by "Handle primitives"
  if (a === null || b === null) {
    return false;
  }

  // Handle Date
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  // Handle objects (including arrays)
  if (typeof a === 'object' && typeof b === 'object') {
    // Compare keys length
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) {
      return false;
    }

    // Check Object values recursively
    for (const key of keysA) {
      if (!valuesAreEqual(a[key], b[key])) {
        return false;
      }
    }
    return true;
  }

  return false;
};
