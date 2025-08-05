import { AerPort } from '@mrtm/api';

import { SubTaskListMap } from '@shared/types';

export const aerPortsMap: SubTaskListMap<AerPort & { uploadPorts: string }> = {
  caption: 'Ports',
  title: 'In port emissions',
  description: 'You can manually add or upload the details for ports and emissions.',
  imoNumber: {
    title: 'Select ship',
    caption: 'Add a new port call',
  },
  portDetails: {
    title: 'Enter port details',
  },
  totalEmissions: {
    caption: 'New port call for',
    title: 'In port emissions',
    description: 'Emissions can be calculated by adding fuel consumption and direct emissions.',
  },
  fuelConsumptions: {
    caption: 'New port call for',
    title: 'Enter fuel consumption',
  },
  directEmissions: {
    caption: 'New port call for',
    title: 'Direct emissions measurement',
  },
  uploadPorts: {
    title: 'Upload the ports and emission details file',
  },
};
