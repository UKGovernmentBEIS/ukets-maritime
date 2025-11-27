import { EmpEmissions, EmpFuelsAndEmissionsFactors, FuelOriginTypeName } from '@mrtm/api';

export const emissionsMock: EmpEmissions = {
  ships: [
    {
      details: {
        imoNumber: '1111111',
        name: 'EVER GREEN',
        type: 'RORO',
        grossTonnage: 5001,
        flagState: 'AI',
        iceClass: 'PC3',
        natureOfReportingResponsibility: 'ISM_COMPANY',
      },
      uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
      fuelsAndEmissionsFactors: [
        {
          origin: 'FOSSIL',
          carbonDioxide: 3.115,
          methane: 0.00005,
          nitrousOxide: 0.00018,
          uniqueIdentifier: '5ea75626-a24f-4140-be9a-4fc2e86b9b81',
          densityMethodBunker: 'FUEL_SUPPLIER',
          densityMethodTank: 'FUEL_SUPPLIER',
          type: 'LFO',
        } as unknown as EmpFuelsAndEmissionsFactors,
      ],
      emissionsSources: [
        {
          referenceNumber: 'Emission serce reference 1',
          name: 'Aux Boiler 1',
          type: 'BOILER',
          sourceClass: 'BOILERS',
          fuelDetails: [
            {
              origin: 'FOSSIL',
              uniqueIdentifier: '5ea75626-a24f-4140-be9a-4fc2e86b9b81',
              type: 'LFO',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['BDN', 'BUNKER_TANK'],
          uniqueIdentifier: '200f57f8-f922-480a-b6e1-79debe72a255',
        },
        {
          referenceNumber: 'Emission source reference 2',
          name: 'Main gas turbine',
          type: 'GAS_TURBINE',
          sourceClass: 'GAS_TURBINE',
          fuelDetails: [
            {
              origin: 'FOSSIL',
              uniqueIdentifier: '5ea75626-a24f-4140-be9a-4fc2e86b9b81',
              type: 'LFO',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['FLOW_METERS'],
          uniqueIdentifier: 'e4073cd3-7a27-4e67-9183-cd3e0fd2811b',
        },
      ],
      uncertaintyLevel: [
        {
          monitoringMethod: 'BDN',
          methodApproach: 'SHIP_SPECIFIC',
          value: '12',
        },
        {
          monitoringMethod: 'BUNKER_TANK',
          methodApproach: 'DEFAULT',
          value: '7.5',
        },
        {
          monitoringMethod: 'FLOW_METERS',
          methodApproach: 'SHIP_SPECIFIC',
          value: '4',
        },
      ],
      carbonCapture: {
        exist: true,
        technologies: {
          description: 'Description',
          files: ['33333333-3333-4333-a333-333333333333'],
          technologyEmissionSources: ['Aux Boiler 1'],
        },
      },
      measurements: [
        {
          name: 'Device 1',
          technicalDescription: 'Technical description 1',
          emissionSources: ['Aux Boiler 1'],
        },
        {
          name: 'Device 2',
          technicalDescription: 'Technical description 2',
          emissionSources: ['Aux Boiler 1', 'Main gas turbine'],
        },
      ],
      exemptionConditions: {
        exist: true,
        minVoyages: 300,
      },
    },
    {
      details: {
        imoNumber: '2222222',
        name: 'Thon Green',
        type: 'CONT',
        grossTonnage: 5300,
        flagState: 'BM',
        iceClass: 'PC3',
        natureOfReportingResponsibility: 'SHIPOWNER',
      },
      uniqueIdentifier: '22222222-2222-4222-a222-222222222222',
      fuelsAndEmissionsFactors: [
        {
          origin: 'FOSSIL',
          carbonDioxide: 3.206,
          methane: 0.00005,
          nitrousOxide: 0.00018,
          methaneSlip: 0,
          uniqueIdentifier: 'e825a83c-7a76-4530-8cb8-750a4cbc4eed',
          densityMethodBunker: 'FUEL_SUPPLIER',
          densityMethodTank: 'LABORATORY_TEST',
          type: 'MDO',
        } as unknown as EmpFuelsAndEmissionsFactors,
        {
          origin: 'RFNBO',
          carbonDioxide: 1.375,
          methane: 0.00005,
          nitrousOxide: 0.00018,
          uniqueIdentifier: '2cf3401b-c143-4c30-ba42-c29f244d3e5c',
          densityMethodBunker: 'LABORATORY_TEST',
          densityMethodTank: 'FUEL_SUPPLIER',
          type: 'E_METHANOL',
        } as unknown as EmpFuelsAndEmissionsFactors,
      ],
      emissionsSources: [
        {
          referenceNumber: 'Emission serce reference 3',
          name: 'Main fuel cell',
          type: 'FUEL_CELLS',
          sourceClass: 'FUEL_CELLS',
          fuelDetails: [
            {
              origin: 'RFNBO',
              uniqueIdentifier: '2cf3401b-c143-4c30-ba42-c29f244d3e5c',
              type: 'E_METHANOL',
            } as FuelOriginTypeName,
          ],
          monitoringMethod: ['BDN', 'BUNKER_TANK'],
          uniqueIdentifier: '836330e3-66df-4960-bf11-159ec234b7c4',
        },
      ],
      uncertaintyLevel: [
        {
          monitoringMethod: 'BDN',
          methodApproach: 'SHIP_SPECIFIC',
          value: '1',
        },
        {
          monitoringMethod: 'BUNKER_TANK',
          methodApproach: 'DEFAULT',
          value: '7.5',
        },
      ],
      carbonCapture: {
        exist: false,
      },
      measurements: [
        {
          name: 'Device 1',
          technicalDescription: 'Technical description 1',
          emissionSources: ['Main fuel cell'],
        },
      ],
      exemptionConditions: {
        exist: true,
        minVoyages: 350,
      },
    },
  ],
};
