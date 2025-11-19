import { FormControl, ValidatorFn } from '@angular/forms';

import { isNil } from 'lodash-es';
import { areIntervalsOverlapping, isBefore } from 'date-fns';

import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { FlattenedPort } from '@requests/common/aer/aer.types';
import {
  formatIsoDateTimeNoMs,
  generatePortUuid,
  generatePortUuidFromFlattened,
  getVoyagePortUuidProperties,
} from '@requests/common/aer/subtasks/utils';

interface PortDateOverlapDto {
  index?: number;
  entityUuid: string;
  imoNumber: string;
  earlierDateTime: Date;
  laterDateTime: Date;
}

const getExistingPortCombinations = (store: RequestTaskStore): PortDateOverlapDto[] => {
  const existingPorts = store.select(aerCommonQuery.selectPorts)() ?? [];
  return existingPorts
    .filter(
      (port) =>
        !isNil(port?.imoNumber) &&
        !isNil(port?.portDetails?.visit?.country) &&
        !isNil(port?.portDetails?.visit?.port) &&
        !isNil(port?.portDetails?.arrivalTime) &&
        !isNil(port?.portDetails?.departureTime),
    )
    .map((port) => ({
      entityUuid: generatePortUuid(
        port.imoNumber,
        port.portDetails.visit.country,
        port.portDetails.visit.port,
        port.portDetails.arrivalTime,
        port.portDetails.departureTime,
      ),
      imoNumber: port.imoNumber,
      earlierDateTime: new Date(port.portDetails.arrivalTime),
      laterDateTime: new Date(port.portDetails.departureTime),
    }));
};

/**
 * Validates that no overlap happens across 2 rows between the range of Arrival and Departure dates in Ports
 * Returns the column and row the error was found at
 */
export function csvFieldPortDateOverlapValidator<T>(
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
    const combinations: PortDateOverlapDto[] = getExistingPortCombinations(store);
    const overlappingIndices: number[] = [];

    data.forEach((entry: FlattenedPort, index) => {
      const fvp: FlattenedPort = getVoyagePortUuidProperties(entry, 'ports') as FlattenedPort;

      if (Object.values(fvp).some((value) => value === null)) {
        return;
      }

      const entityUuid = generatePortUuidFromFlattened(fvp);
      const imoNumber = entry.imoNumber;
      const earlierDateTime = new Date(formatIsoDateTimeNoMs(entry.arrivalDate, entry.arrivalActualTime));
      const laterDateTime = new Date(formatIsoDateTimeNoMs(entry.departureDate, entry.departureActualTime));

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
          overlappingIndices.push(index + 1);
        }
      });

      combinations.push({
        index: index + 1,
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
        ['csvFieldPortsDateOverlapValidator']: {
          rows: errorMessageRows,
          columns: null,
          message: `The fields '${earlierFieldName}' and '${laterFieldName}' overlap with another port of the same ship`,
        },
      };
    }

    return null;
  };
}
