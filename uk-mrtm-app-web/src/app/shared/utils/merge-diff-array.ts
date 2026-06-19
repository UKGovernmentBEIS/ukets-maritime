import { RegisteredOwnerShipDetails } from '@mrtm/api';

import { DiffItem, MandateRegisteredOwnerTableListItem, ShipEmissionTableListItem } from '@shared/types';

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

/**
 * Groups MandateRegisteredOwnerTableListItem[] by uniqueIdentifier to DiffItem<MandateRegisteredOwnerTableListItem>[]
 * and sorts them by current.name
 */
export const mergeDiffRegisteredOwners = (
  currentArray: MandateRegisteredOwnerTableListItem[],
  previousArray: MandateRegisteredOwnerTableListItem[],
): DiffItem<MandateRegisteredOwnerTableListItem>[] => {
  const map = new Map<string, DiffItem<MandateRegisteredOwnerTableListItem>>();

  if (previousArray?.length) {
    for (const owner of previousArray) {
      if (!map.has(owner.uniqueIdentifier)) {
        map.set(owner.uniqueIdentifier, { previous: owner });
      } else {
        map.get(owner.uniqueIdentifier).previous = owner;
      }
    }
  }

  if (currentArray?.length) {
    for (const owner of currentArray) {
      if (!map.has(owner.uniqueIdentifier)) {
        map.set(owner.uniqueIdentifier, { current: owner });
      } else {
        map.get(owner.uniqueIdentifier).current = owner;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a?.current?.name?.localeCompare(b?.current?.name)) ?? [];
};

export const mergeDiffShipDetails = (
  currentArray: RegisteredOwnerShipDetails[],
  previousArray: RegisteredOwnerShipDetails[],
): DiffItem<RegisteredOwnerShipDetails>[] => {
  const map = new Map<string, DiffItem<RegisteredOwnerShipDetails>>();

  if (previousArray?.length) {
    for (const details of previousArray) {
      if (!map.has(details.imoNumber)) {
        map.set(details.imoNumber, { previous: details });
      } else {
        map.get(details.imoNumber).previous = details;
      }
    }
  }

  if (currentArray?.length) {
    for (const details of currentArray) {
      if (!map.has(details.imoNumber)) {
        map.set(details.imoNumber, { current: details });
      } else {
        map.get(details.imoNumber).current = details;
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a?.current?.name?.localeCompare(b?.current?.name)) ?? [];
};
