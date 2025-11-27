import { AER_AGGREGATED_DATA_SUB_TASK } from '@requests/common/aer/subtasks/aer-aggregated-data';
import { AER_PORTS_SUB_TASK } from '@requests/common/aer/subtasks/aer-ports';
import { AER_VOYAGES_SUB_TASK } from '@requests/common/aer/subtasks/aer-voyages';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';

export const getShipsSectionKey = (uniqueIdentifier: string): string =>
  `${EMISSIONS_SUB_TASK}-ship-${uniqueIdentifier}`;

export const getVoyagesSectionKey = (uniqueIdentifier: string): string =>
  `${AER_VOYAGES_SUB_TASK}-voyage-${uniqueIdentifier}`;

export const getPortsSectionKey = (uniqueIdentifier: string): string =>
  `${AER_PORTS_SUB_TASK}-port-call-${uniqueIdentifier}`;

export const getAggregatedDataSectionKey = (uniqueIdentifier: string): string =>
  `${AER_AGGREGATED_DATA_SUB_TASK}-aggregated-data-${uniqueIdentifier}`;
