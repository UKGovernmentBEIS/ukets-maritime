import { AerEmissions, AerFuelsAndEmissionsFactors, FuelOriginTypeName } from '@mrtm/api';

export const aerEmissionsMock: AerEmissions = {
  ships: [
    {
      dataInputType: 'MANUAL',
      details: {
        imoNumber: '1111111',
        name: 'SameMonitoringMethod',
        type: 'COMB',
        grossTonnage: 10000,
        flagState: 'GR',
        iceClass: 'PC1',
        natureOfReportingResponsibility: 'SHIPOWNER',
        allYear: true,
      },
      uniqueIdentifier: '79df5610-9b70-4e3e-8f09-5b1b351560bd',
      fuelsAndEmissionsFactors: [
        {
          origin: 'FOSSIL',
          carbonDioxide: '3.114',
          methane: '0.00005',
          nitrousOxide: '0.1',
          uniqueIdentifier: 'e2b51837-98be-4c79-a9e8-69751dff9347',
          type: 'HFO',
        } as AerFuelsAndEmissionsFactors,
        {
          origin: 'RFNBO',
          carbonDioxide: '0',
          methane: '0.00005',
          nitrousOxide: '0.00018',
          uniqueIdentifier: '17d3d184-1c01-4a98-8bc5-d07c9edc1eef',
          type: 'E_NH3',
        } as AerFuelsAndEmissionsFactors,
        {
          origin: 'FOSSIL',
          name: 'Custom Fuel 1',
          carbonDioxide: '1',
          methane: '3',
          nitrousOxide: '2',
          uniqueIdentifier: '146147de-af0d-47da-8f95-b7967ba093d0',
          type: 'OTHER',
        } as AerFuelsAndEmissionsFactors,
        {
          origin: 'BIOFUEL',
          carbonDioxide: '2.75',
          methane: '0',
          nitrousOxide: '0.00011',
          uniqueIdentifier: '9e5804cc-cd61-4c5a-a092-ae904dd8c1d2',
          type: 'BIO_LNG',
        } as AerFuelsAndEmissionsFactors,
      ],
      emissionsSources: [
        {
          name: 'Main Engine 2',
          type: 'AUX_ENGINE',
          sourceClass: 'ICE',
          fuelDetails: [
            {
              origin: 'FOSSIL',
              uniqueIdentifier: 'e2b51837-98be-4c79-a9e8-69751dff9347',
              type: 'HFO',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['FLOW_METERS'],
          uniqueIdentifier: 'f7efca19-a584-4df6-a216-6b8e869cc757',
        },
        {
          name: 'Boiler 1',
          type: 'GAS_TURBINE',
          sourceClass: 'GAS_TURBINE',
          fuelDetails: [
            {
              origin: 'FOSSIL',
              name: 'Custom Fuel 1',
              uniqueIdentifier: '146147de-af0d-47da-8f95-b7967ba093d0',
              methaneSlip: '0.2',
              methaneSlipValueType: 'PRESELECTED',
              type: 'OTHER',
            } as FuelOriginTypeName,
            {
              origin: 'BIOFUEL',
              uniqueIdentifier: '9e5804cc-cd61-4c5a-a092-ae904dd8c1d2',
              methaneSlip: '3.1',
              methaneSlipValueType: 'PRESELECTED',
              type: 'BIO_LNG',
            } as FuelOriginTypeName,
            {
              origin: 'RFNBO',
              uniqueIdentifier: '182b17e9-22ff-4f35-8ffd-796c98964cf3',
              type: 'E_NH3',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['BDN'],
          uniqueIdentifier: 'e226a1d7-33c2-4a61-97be-dfda7de47ada',
        },
      ],
      uncertaintyLevel: [
        {
          monitoringMethod: 'BDN',
          methodApproach: 'DEFAULT',
          value: '7.5',
        },
        {
          monitoringMethod: 'FLOW_METERS',
          methodApproach: 'SHIP_SPECIFIC',
          value: '0.01',
        },
      ],
      derogations: {
        exceptionFromPerVoyageMonitoring: false,
      },
    },
    {
      dataInputType: 'MANUAL',
      details: {
        imoNumber: '2222222',
        name: 'SameMonitoringMethod',
        type: 'COMB',
        grossTonnage: 10000,
        flagState: 'GR',
        iceClass: 'PC1',
        natureOfReportingResponsibility: 'SHIPOWNER',
        allYear: true,
      },
      uniqueIdentifier: '7e985e22-343a-4283-a7ce-962efb9f9ff1',
      fuelsAndEmissionsFactors: [
        {
          origin: 'FOSSIL',
          carbonDioxide: '3.114',
          methane: '0.00005',
          nitrousOxide: '0.1',
          uniqueIdentifier: '341fc26f-87e8-45ed-a8d0-e0036a79bf67',
          type: 'HFO',
        } as AerFuelsAndEmissionsFactors,
        {
          origin: 'BIOFUEL',
          carbonDioxide: '2.834',
          methane: '0.24',
          nitrousOxide: '0.22',
          uniqueIdentifier: '6a237ec3-1e66-46b5-97c1-6bd865bef2f5',
          type: 'BIO_DIESEL',
        } as AerFuelsAndEmissionsFactors,
        {
          origin: 'FOSSIL',
          carbonDioxide: '2.75',
          methane: '0',
          nitrousOxide: '0.00011',
          uniqueIdentifier: 'f4f5f382-f125-4b4f-86dd-934792e022d6',
          type: 'LNG',
        } as AerFuelsAndEmissionsFactors,
      ],
      emissionsSources: [
        {
          name: 'Main Engine 1',
          type: 'MAIN_ENGINE',
          sourceClass: 'ICE',
          fuelDetails: [
            {
              origin: 'BIOFUEL',
              uniqueIdentifier: '6a237ec3-1e66-46b5-97c1-6bd865bef2f5',
              type: 'BIO_DIESEL',
            } as FuelOriginTypeName,
            {
              origin: 'FOSSIL',
              uniqueIdentifier: 'f4f5f382-f125-4b4f-86dd-934792e022d6',
              methaneSlip: '2',
              methaneSlipValueType: 'OTHER',
              type: 'LNG',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['BDN'],
          uniqueIdentifier: 'f7d31333-bda7-4df1-8472-41c95e364ad5',
        },
        {
          name: 'Main Engine 2',
          type: 'AUX_ENGINE',
          sourceClass: 'ICE',
          fuelDetails: [
            {
              origin: 'FOSSIL',
              uniqueIdentifier: '341fc26f-87e8-45ed-a8d0-e0036a79bf67',
              type: 'HFO',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['FLOW_METERS'],
          uniqueIdentifier: '4c4253d4-8cb3-418e-b810-afca1f285550',
        },
      ],
      uncertaintyLevel: [
        {
          monitoringMethod: 'BDN',
          methodApproach: 'DEFAULT',
          value: '7.5',
        },
        {
          monitoringMethod: 'FLOW_METERS',
          methodApproach: 'SHIP_SPECIFIC',
          value: '0.01',
        },
      ],
      derogations: {
        exceptionFromPerVoyageMonitoring: false,
      },
    },
  ],
};
