/**
 * Recursively removes all null, undefined, empty string, and empty object
 * values from the provided object or array.
 * For arrays, it filters out elements that fulfill these conditions.
 * For objects, it removes properties with such values, including deeply nested instances.
 */
export const cleanDeep = <T>(obj: T) => {
  if (Array.isArray(obj)) {
    return obj
      .map((v) => (v && typeof v === 'object' ? cleanDeep(v) : v))
      .filter(
        (v) => !(v === null || v === undefined || v === '' || (typeof v === 'object' && Object.keys(v).length === 0)),
      );
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const cleanedValue = value && typeof value === 'object' ? cleanDeep(value) : value;

    const isEmptyObject = cleanedValue && typeof cleanedValue === 'object' && Object.keys(cleanedValue)?.length === 0;
    const isNullOrUndefined = cleanedValue === null || cleanedValue === undefined;
    const isEmptyString = cleanedValue === '';

    if (!isNullOrUndefined && !isEmptyString && !isEmptyObject) {
      acc[key] = cleanedValue;
    }

    return acc;
  }, {});
};
