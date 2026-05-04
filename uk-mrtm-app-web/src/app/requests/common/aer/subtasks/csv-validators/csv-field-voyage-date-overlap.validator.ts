import { FormControl, ValidatorFn } from '@angular/forms';

import { areIntervalsOverlapping, isBefore } from 'date-fns';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { FlattenedVoyage } from '@requests/common/aer/aer.types';
import {
  formatIsoDateTimeNoMs,
  generateVoyageUuid,
  generateVoyageUuidFromFlattened,
  getVoyagePortUuidProperties,
} from '@requests/common/aer/subtasks/utils';
import { isNil } from '@shared/utils';

interface VoyageDateOverlapDto {
  index?: number;
  entityUuid: string;
  imoNumber: string;
  earlierDateTime: Date;
  laterDateTime: Date;
}

const getExistingVoyageCombinations = (store: RequestTaskStore): VoyageDateOverlapDto[] => {
  const existingVoyages = store.select(aerCommonQuery.selectVoyages)() ?? [];
  return existingVoyages
    .filter(
      (voyage) =>
        !isNil(voyage?.imoNumber) &&
        !isNil(voyage?.voyageDetails?.departurePort?.country) &&
        !isNil(voyage?.voyageDetails?.departurePort?.port) &&
        !isNil(voyage?.voyageDetails?.departureTime) &&
        !isNil(voyage?.voyageDetails?.arrivalPort?.country) &&
        !isNil(voyage?.voyageDetails?.arrivalPort?.port) &&
        !isNil(voyage?.voyageDetails?.arrivalTime),
    )
    .map((voyage) => ({
      entityUuid: generateVoyageUuid(
        voyage?.imoNumber,
        voyage?.voyageDetails?.departurePort?.country,
        voyage?.voyageDetails?.departurePort?.port,
        voyage?.voyageDetails?.departureTime,
        voyage?.voyageDetails?.arrivalPort?.country,
        voyage?.voyageDetails?.arrivalPort?.port,
        voyage?.voyageDetails?.arrivalTime,
      ),
      imoNumber: voyage.imoNumber,
      earlierDateTime: new Date(voyage?.voyageDetails?.departureTime),
      laterDateTime: new Date(voyage?.voyageDetails?.arrivalTime),
    }));
};

/**
 * Validates that no overlap happens across 2 rows between the range of Departure and Arrival dates in Voyages
 * Returns the column and row the error was found at
 */
export function csvFieldVoyageDateOverlapValidator<T>(
  earlierDateField: keyof T,
  laterDateField: keyof T,
  csvMap: Record<keyof T, string>,
  store: RequestTaskStore,
): ValidatorFn {
  return (control: FormControl): { [key: string]: any } | null => {
    const data = control.value;

    if (!Array.isArray(data) || !data?.length) {
      return null;
    }

    const errorMessageRows = [];
    const combinations: VoyageDateOverlapDto[] = getExistingVoyageCombinations(store);
    const overlappingIndices: number[] = [];

    data.forEach((entry: FlattenedVoyage, index) => {
      const fvp: FlattenedVoyage = getVoyagePortUuidProperties(entry, 'voyages') as FlattenedVoyage;

      if (Object.values(fvp).some((value) => value === null)) {
        return;
      }

      const entityUuid = generateVoyageUuidFromFlattened(fvp);
      const imoNumber = entry.imoNumber;
      const earlierDateTime = new Date(formatIsoDateTimeNoMs(entry.departureDate, entry.departureActualTime));
      const laterDateTime = new Date(formatIsoDateTimeNoMs(entry.arrivalDate, entry.arrivalActualTime));

      combinations.forEach((combination) => {
        if (
          isBefore(laterDateTime, earlierDateTime) ||
          isBefore(combination.laterDateTime, combination.earlierDateTime)
        ) {
          return;
        }

        if (
          entityUuid !== combination.entityUuid &&
          imoNumber === combination.imoNumber &&
          areIntervalsOverlapping(
            {
              start: earlierDateTime,
              end: laterDateTime,
            },
            {
              start: combination.earlierDateTime,
              end: combination.laterDateTime,
            },
            {
              inclusive: true,
            },
          )
        ) {
          overlappingIndices.push(index + 2);
        }
      });

      combinations.push({
        index: index + 2,
        entityUuid: entityUuid,
        imoNumber: imoNumber,
        earlierDateTime: earlierDateTime,
        laterDateTime: laterDateTime,
      });
    });

    if (overlappingIndices.length > 0) {
      const uniqueKeys = new Set(overlappingIndices);
      uniqueKeys.forEach((key) => {
        errorMessageRows.push({
          rowIndex: key,
        });
      });
    }

    if (errorMessageRows.length > 0) {
      const earlierFieldName = csvMap?.[earlierDateField];
      const laterFieldName = csvMap?.[laterDateField];
      return {
        ['csvFieldVoyagesDateOverlapValidator']: {
          rows: errorMessageRows,
          columns: null,
          message: `The fields '${earlierFieldName}' and '${laterFieldName}' overlap with another voyage of the same ship`,
        },
      };
    }

    return null;
  };
}
