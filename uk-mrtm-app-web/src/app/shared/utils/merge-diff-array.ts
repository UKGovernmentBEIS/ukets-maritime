import { DiffItem, ShipEmissionTableListItem } from '@shared/types';

export const mergeDiffArray = <T>(currentArray: Array<T>, previousArray: Array<T>): Array<DiffItem<T>> => {
  const resultArray: Array<DiffItem<T>> = [];
  const currentLength = currentArray?.length ?? 0;
  const previousLength = previousArray?.length ?? 0;
  const maxDiffArray = Math.max(currentLength, previousLength);

  for (let i = 0; i < maxDiffArray; i++) {
    resultArray.push({
      current: i >= currentLength ? undefined : currentArray[i],
      previous: i >= previousLength ? undefined : previousArray[i],
    });
  }

  return resultArray;
};

/**
 * Groups ShipEmissionTableListItem[] by uniqueIdentifier to DiffItem<ShipEmissionTableListItem>[]
 * and sorts them by current.name
 */
export const mergeDiffShips = (
  currentArray: ShipEmissionTableListItem[],
  previousArray: ShipEmissionTableListItem[],
): DiffItem<ShipEmissionTableListItem>[] => {
  const map = new Map<string, DiffItem<ShipEmissionTableListItem>>();

  if (previousArray?.length) {
    for (const ship of previousArray) {
      if (!map.has(ship.uniqueIdentifier)) {
        map.set(ship.uniqueIdentifier, { previous: ship });
      } else {
        map.get(ship.uniqueIdentifier).previous = ship;
      }
    }
  }

  if (currentArray?.length) {
    for (const ship of currentArray) {
      if (!map.has(ship.uniqueIdentifier)) {
        map.set(ship.uniqueIdentifier, { current: ship });
      } else {
        map.get(ship.uniqueIdentifier).current = ship;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a?.current?.name?.localeCompare(b?.current?.name)) ?? [];
};
