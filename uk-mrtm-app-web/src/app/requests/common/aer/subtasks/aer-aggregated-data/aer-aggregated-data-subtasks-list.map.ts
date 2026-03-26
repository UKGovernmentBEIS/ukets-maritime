import { AerShipAggregatedData } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const aerAggregatedDataSubtasksListMap: SubTaskListMap<
  AerShipAggregatedData & {
    annualAggregatedEmissions: string;
    uploadAggregatedData: string;
    uploadAggregatedDataConfirmation: string;
  }
> = {
  caption: 'Aggregated data',
  title: 'Aggregated data for ships',
  description:
    'If the calculations from voyages and port calls have been added, you can use them, otherwise you can manually add the calculations, or upload a file instead.',
  imoNumber: {
    title: 'Select ship',
    caption: 'Add aggregated data',
  },
  fuelConsumptions: {
    caption: 'Add aggregated data for',
    title: 'Total amount of each fuel type consumed',
  },
  annualAggregatedEmissions: {
    caption: 'Add aggregated data for',
    title: 'Annual aggregated emissions',
  },
  emissionsWithinUKPorts: {
    title: 'Aggregated greenhouse gas emissions which occurred within UK ports',
  },
  emissionsBetweenUKPorts: {
    title: 'Aggregated greenhouse gas emissions from all voyages between UK ports',
  },
  emissionsBetweenUKAndNIVoyages: {
    title: 'Aggregated greenhouse gas emissions from all voyages between Great Britain and Northern Ireland',
  },
  totalEmissionsFromVoyagesAndPorts: {
    title: 'Total aggregated greenhouse gas emitted',
  },
  totalShipEmissions: {
    caption: 'Add aggregated data for',
    title: 'Emissions from the ship',
  },
  uploadAggregatedData: {
    title: 'Upload the aggregated data for ships file',
  },
  uploadAggregatedDataConfirmation: {
    title: 'Are you sure you want to replace the data?',
  },
  fromFetch: {
    title: 'Import aggregated data from voyages and ports',
    description:
      'If you import the aggregated data from voyages and ports, all of the data that has been entered will be replaced.',
  },
};
