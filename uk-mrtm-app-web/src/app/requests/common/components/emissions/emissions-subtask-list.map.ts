import { SubTaskListMap } from '@shared/types';

export const emissionsSubtaskMap: SubTaskListMap<{
  ships: string;
  uploadShips: string;
  uploadShipsConfirmation: string;
}> = {
  title: 'List of ships and calculation of maritime emissions',
  ships: { title: 'Add ships and emission details' },
  uploadShips: {
    title: 'Upload the ships and emission details file',
  },
  uploadShipsConfirmation: {
    title: 'Are you sure you want to replace the data?',
  },
};

export const emissionsShipSubtaskMap: SubTaskListMap<{
  details: string;
  imoNumber: string;
  name: string;
  type: string;
  grossTonnage: string;
  flagState: string;
  iceClass: string;
  natureOfReportingResponsibility: string;
  allYear: string;
  fuelsAndEmissionsFactors: string;
  fuelsAndEmissionsFactorsFormAdd: string;
  fuelsAndEmissionsFactorsFormEdit: string;
  emissionsSources: string;
  emissionsSourcesFormAdd: string;
  emissionsSourcesFormEdit: string;
  uncertaintyLevel: string;
}> = {
  title: 'Add ship details',

  // DETAILS
  details: { title: 'Enter basic ship details' },
  imoNumber: { title: 'IMO number' },
  name: { title: 'Name' },
  type: { title: 'Type' },
  grossTonnage: { title: 'Gross tonnage' },
  flagState: { title: 'Flag state' },
  iceClass: { title: 'Ice class' },
  natureOfReportingResponsibility: { title: 'Nature of reporting responsibility' },
  allYear: { title: 'Date' },

  fuelsAndEmissionsFactors: { title: 'Fuels and emissions factors' },
  fuelsAndEmissionsFactorsFormAdd: { title: 'Add new fuel and emissions factor details' },
  fuelsAndEmissionsFactorsFormEdit: { title: 'Edit fuels and emissions factors details' },
  emissionsSources: { title: 'Emissions sources and fuel types used' },
  emissionsSourcesFormAdd: { title: 'Add new emissions source and fuel types used' },
  emissionsSourcesFormEdit: { title: 'Edit emissions source and fuel types used' },
  uncertaintyLevel: { title: 'Level of uncertainty associated with the fuel monitoring methods' },
};
