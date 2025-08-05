import { TestBed } from '@angular/core/testing';

import { EmpShipsXmlService } from '@requests/common/emp/subtasks/emissions/services';
import { mockEmpShipsPartialErrorsXml, mockEmpShipsXml } from '@requests/common/emp/testing/mock-emp-ship-xml';

describe('EmpShipsXmlService', () => {
  let service: EmpShipsXmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpShipsXmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should correctly transform ShipXML to XmlShipsResultDto', () => {
    const getFixedUUID = jest.fn().mockReturnValue('11111111-1111-4111-a111-111111111111');
    Object.defineProperty(window, 'crypto', {
      value: { getRandomValues: getFixedUUID, randomUUID: getFixedUUID },
    });

    const result = service.parse(mockEmpShipsXml);
    expect(result).toEqual({
      data: [
        {
          carbonCapture: {
            exist: true,
            technologies: {
              description: 'string',
              technologyEmissionSources: ['Main Engine 1'],
            },
          },
          details: {
            flagState: 'NO',
            grossTonnage: 5000,
            iceClass: 'IC',
            imoNumber: '2222222',
            name: 'Ever Green',
            natureOfReportingResponsibility: 'ISM_COMPANY',
            type: 'BULK',
          },
          emissionsSources: [
            {
              fuelDetails: [
                {
                  methaneSlip: '2',
                  methaneSlipValueType: 'OTHER',
                  name: 'other1',
                  origin: 'RFNBO',
                  type: 'OTHER',
                  uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
                },
                {
                  methaneSlip: '2',
                  methaneSlipValueType: 'OTHER',
                  name: 'other3',
                  origin: 'BIOFUEL',
                  type: 'OTHER',
                  uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
                },
                {
                  methaneSlip: '2',
                  methaneSlipValueType: 'OTHER',
                  name: 'other2',
                  origin: 'FOSSIL',
                  type: 'OTHER',
                  uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
                },
              ],
              monitoringMethod: ['FLOW_METERS'],
              name: 'Main Engine 1',
              referenceNumber: 'IDE-111',
              sourceClass: 'BOILERS',
              type: 'MAIN_ENGINE',
              uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
            },
          ],
          exemptionConditions: {
            exist: true,
            minVoyages: 301,
          },
          fuelsAndEmissionsFactors: [
            {
              carbonDioxide: 0.1,
              densityMethodBunker: 'FUEL_SUPPLIER',
              densityMethodTank: 'FUEL_SUPPLIER',
              methane: 0.1,
              name: 'other1',
              nitrousOxide: 0.2,
              origin: 'RFNBO',
              type: 'OTHER',
              uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
            },
            {
              carbonDioxide: 0.1,
              densityMethodBunker: 'FUEL_SUPPLIER',
              densityMethodTank: 'FUEL_SUPPLIER',
              methane: 0.1,
              name: 'other2',
              nitrousOxide: 0.2,
              origin: 'FOSSIL',
              type: 'OTHER',
              uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
            },
            {
              carbonDioxide: 0.1,
              densityMethodBunker: 'FUEL_SUPPLIER',
              densityMethodTank: 'FUEL_SUPPLIER',
              methane: 0.1,
              name: 'other3',
              nitrousOxide: 0.2,
              origin: 'BIOFUEL',
              type: 'OTHER',
              uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
            },
          ],
          measurements: [
            {
              emissionSources: ['Main Engine 1'],
              name: 'string',
            },
          ],
          uncertaintyLevel: [
            {
              methodApproach: 'SHIP_SPECIFIC',
              monitoringMethod: 'FLOW_METERS',
              value: 99.12,
            },
          ],
          uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
        },
      ],
      errors: [],
    });
  });

  it('should return errors on false XML', () => {
    const getFixedUUID = jest.fn().mockReturnValue('11111111-1111-4111-a111-111111111111');
    Object.defineProperty(window, 'crypto', {
      value: { getRandomValues: getFixedUUID, randomUUID: getFixedUUID },
    });
    const result = service.parse(mockEmpShipsPartialErrorsXml);
    expect(result).toEqual({
      data: [
        {
          carbonCapture: {},
          details: {
            imoNumber: '1111111',
            name: 'Ship1',
            type: 'RORO',
          },
          emissionsSources: [],
          exemptionConditions: {},
          fuelsAndEmissionsFactors: [],
          measurements: [],
          uncertaintyLevel: [],
          uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
        },
      ],
      errors: [
        {
          column: 'shipImoNumber',
          message: 'The IMO Number must be 7 digits and is required',
          row: 1,
        },
        {
          column: 'name',
          message: 'The Ship Name is required and must be less than 30 characters',
          row: 1,
        },
        {
          column: 'shipType',
          message: 'The Ship Type is invalid',
          row: 1,
        },
        {
          column: 'shipImoNumber',
          message: 'There are duplicated IMO numbers in the file',
          row: 3,
        },
      ],
    });
  });
});
