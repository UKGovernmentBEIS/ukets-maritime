import { produce } from 'immer';

import {
  AdditionalDocuments,
  EmpAbbreviations,
  EmpControlActivities,
  EmpDataGaps,
  EmpEmissionSources,
  EmpMandate,
  EmpMonitoringGreenhouseGas,
  EmpOperatorDetails,
  EmpProcedureForm,
} from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskState } from '@netz/common/store';

import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { TaskItemStatus } from '@requests/common/task-item-status';

export const mockEmpAbbreviations: EmpAbbreviations = {
  exist: true,
  abbreviationDefinitions: [
    {
      definition: 'Definition1',
      abbreviation: 'Abbreviation1',
    },
    {
      definition: 'Definition2',
      abbreviation: 'Abbreviation2',
    },
  ],
};

export const mockAdditionalDocuments: AdditionalDocuments = {
  exist: true,
  documents: ['11111111-1111-4111-a111-111111111111'],
};

export const mockEmpDataGaps: EmpDataGaps = {
  formulaeUsed: 'test formulaeUsed',
  fuelConsumptionEstimationMethod: 'test fuelConsumptionEstimationMethod',
  responsiblePersonOrPosition: 'test responsiblePersonOrPosition',
  dataSources: 'test dataSources',
  recordsLocation: 'test recordsLocation',
  itSystemUsed: 'test itSystemUsed',
};

export const mockEmpProcedureForm: EmpProcedureForm = {
  recordsLocation: 'test recordsLocation',
  responsiblePersonOrPosition: 'test responsiblePersonOrPosition',
  description: 'test description',
  itSystemUsed: null,
  version: null,
  reference: 'test reference',
};

export const mockEmpEmissionSources: EmpEmissionSources = {
  listCompletion: {
    ...mockEmpProcedureForm,
  },
  emissionFactors: {
    exist: false,
    factors: {
      ...mockEmpProcedureForm,
    },
  },
  emissionCompliance: {
    exist: true,
    criteria: {
      ...mockEmpProcedureForm,
    },
  },
};

export const mockGreenhouseGas: EmpMonitoringGreenhouseGas = {
  fuel: { ...mockEmpProcedureForm },
  voyages: { ...mockEmpProcedureForm },
  qaEquipment: { ...mockEmpProcedureForm },
  information: { ...mockEmpProcedureForm },
  crossChecks: { ...mockEmpProcedureForm },
};

export const mockEmpMandate: EmpMandate = {
  exist: true,
  registeredOwners: [
    {
      uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
      name: 'RegisteredOwner1',
      imoNumber: '1000000',
      contactName: 'RegisteredOwner1',
      email: 'RegisteredOwner1@o.com',
      effectiveDate: '2025-03-01',
      ships: [
        {
          imoNumber: '1111111',
          name: 'EVER GREEN',
        },
      ],
    },
    {
      uniqueIdentifier: '22222222-2222-4222-a222-222222222222',
      name: 'RegisteredOwner2',
      imoNumber: '2000000',
      contactName: 'RegisteredOwner2',
      email: 'RegisteredOwner2@o.com',
      effectiveDate: '2025-03-01',
      ships: [
        {
          imoNumber: '2222222',
          name: 'Thon Green',
        },
      ],
    },
  ],
  responsibilityDeclaration: true,
};

export const mockEmpControlActivities: EmpControlActivities = {
  documentation: { ...mockEmpProcedureForm },
  outsourcedActivities: {
    exist: true,
    details: { ...mockEmpProcedureForm },
  },
  corrections: { ...mockEmpProcedureForm },
  internalReviews: { ...mockEmpProcedureForm },
  qualityAssurance: { ...mockEmpProcedureForm },
};

export const mockEmpOperatorDetails: EmpOperatorDetails = {
  operatorName: 'Test Maritime Operator Ltd',
  imoNumber: '9876543',
  contactAddress: {
    line1: '123 Harbor Street',
    line2: 'Suite 456',
    city: 'Southampton',
    country: 'GB',
    postcode: 'SO14 3AA',
  },
  organisationStructure: {
    legalStatusType: 'LIMITED_COMPANY',
    registeredAddress: {
      line1: '456 Business Park',
      line2: 'Floor 3',
      city: 'London',
      country: 'GB',
      postcode: 'EC1A 1BB',
    },
    sameAsContactAddress: false,
  },
  activityDescription: 'Maritime transport services including cargo and container shipping operations',
};

export const mockEmpIssuanceSubmitRequestTask = {
  ...mockRequestTask,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'EMP_ISSUANCE_APPLICATION_SUBMIT',
      payload: {
        payloadType: 'EMP_ISSUANCE_APPLICATION_SUBMIT_PAYLOAD',
        emissionsMonitoringPlan: {},
        empSectionsCompleted: {},
        empAttachments: {},
      } as EmpTaskPayload,
    },
  },
};

export const mockStateBuild = (
  data?: Partial<Record<keyof EmpTaskPayload['emissionsMonitoringPlan'], any>>,
  taskStatus?: Partial<Record<keyof EmpTaskPayload['emissionsMonitoringPlan'], TaskItemStatus>>,
  attachments?: EmpTaskPayload['empAttachments'],
): RequestTaskState => {
  return {
    ...mockEmpIssuanceSubmitRequestTask,
    requestTaskItem: produce(mockEmpIssuanceSubmitRequestTask.requestTaskItem, (requestTaskItem) => {
      const payload = requestTaskItem.requestTask.payload as EmpTaskPayload;

      payload.emissionsMonitoringPlan = { ...payload.emissionsMonitoringPlan, ...data };
      payload.empSectionsCompleted = { ...payload.empSectionsCompleted, ...taskStatus };
      payload.empAttachments = { ...payload.empAttachments, ...attachments };
    }),
  };
};
