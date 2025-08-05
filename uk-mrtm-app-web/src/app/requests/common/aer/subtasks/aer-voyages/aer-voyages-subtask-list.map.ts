import { AerVoyage } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const aerVoyagesMap: SubTaskListMap<AerVoyage & { uploadVoyages: string }> = {
  caption: 'Voyages',
  title: 'Voyages and emission details list',
  description: 'You can manually add or upload the details for voyages and emissions.',
  imoNumber: {
    title: 'Select ship',
    caption: 'New voyage',
  },
  voyageDetails: {
    caption: 'New voyage for',
    title: 'Enter voyage details',
  },
  totalEmissions: {
    caption: 'New voyage for',
    title: 'Emissions from voyage',
    description: 'Emissions can be calculated by adding fuel consumption and direct emissions.',
  },
  fuelConsumptions: {
    caption: 'New voyage for',
    title: 'Enter fuel consumption',
  },
  directEmissions: {
    caption: 'New voyage for',
    title: 'Direct emissions measurement',
  },
  uploadVoyages: {
    title: 'Upload the voyages and emission details file',
  },
};
