/**
 * Compares two values to determine if they are deeply equal.
 *
 * Performs a deep comparison between the two provided values,
 * supporting primitive types, objects, arrays, Date instances, and RegExp instances.
 * It recursively checks nested properties if both values are objects.
 */
export const isEqual = (valueA: any, valueB: any): boolean => {
  if (valueA === valueB) {
    return true;
  }

  if (valueA instanceof Date && valueB instanceof Date) {
    return valueA.getTime() === valueB.getTime();
  }

  if (valueA instanceof RegExp && valueB instanceof RegExp) {
    return valueA.toString() === valueB.toString();
  }

  if (!valueA || !valueB || typeof valueA !== 'object' || typeof valueB !== 'object') {
    return valueA === valueB;
  }

  const keysValue = Object.keys(valueA);
  const keysOther = Object.keys(valueB);
  if (keysValue.length !== keysOther.length) {
    return false;
  }

  return keysValue.every(
    (key) => Object.prototype.hasOwnProperty.call(valueB, key) && isEqual(valueA[key], valueB[key]),
  );
};
