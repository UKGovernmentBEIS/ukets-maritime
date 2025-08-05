import {
  EmpControlActivities,
  EmpEmissions,
  EmpEmissionSources,
  EmpManagementProcedures,
  EmpMonitoringGreenhouseGas,
  EmpShipEmissions,
} from '@mrtm/api';

import { emissionsShipSubtaskMap, emissionsSubtaskMap } from '@requests/common/components/emissions';
import { operatorDetailsMap } from '@requests/common/components/operator-details';
import { EmpVariationRegulatorTaskPayload, EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { SubTaskListMap } from '@shared/types';

export const abbreviationsMap: SubTaskListMap<{
  abbreviationsQuestion: string;
  variationRegulatorDecision: string;
  decision: string;
}> = {
  title: 'List of definitions and abbreviations',
  abbreviationsQuestion: {
    title: 'Are you using any abbreviations or terminology in your application which need explanation?',
  },
  variationRegulatorDecision: {
    title: 'Update list of definitions and abbreviations',
  },
  decision: {
    title: 'Review list of definitions and abbreviations',
  },
};

export const additionalDocumentsMap: SubTaskListMap<{
  additionalDocumentsUpload: string;
  variationRegulatorDecision: string;
  decision: string;
}> = {
  title: 'Additional information',
  additionalDocumentsUpload: {
    title: 'Do you want to upload any additional documents or information to support your application?',
  },
  variationRegulatorDecision: {
    title: 'Update additional information',
  },
  decision: {
    title: 'Review additional information',
  },
};

export const managementProceduresMap: SubTaskListMap<
  EmpManagementProcedures & {
    variationRegulatorDecision: string;
    decision: string;
  }
> = {
  title: 'Management procedures',
  monitoringReportingRoles: {
    title: 'Monitoring and reporting roles',
  },
  regularCheckOfAdequacy: {
    title: 'Regular check of the adequacy of the monitoring plan',
  },
  dataFlowActivities: {
    title: 'Procedures for data flow activities',
  },
  riskAssessmentProcedures: {
    title: 'Procedures for risk assessment',
  },
  variationRegulatorDecision: {
    title: 'Update management procedures',
  },
  decision: {
    title: 'Review management procedures',
  },
};

export const identifyMaritimeOperatorMap = operatorDetailsMap;

export const controlActivitiesMap: SubTaskListMap<
  EmpControlActivities & {
    variationRegulatorDecision: string;
    decision: string;
  }
> = {
  title: 'Control Activities',
  qualityAssurance: {
    title: 'Quality assurance and reliability of information technology',
  },
  internalReviews: {
    title: 'Internal reviews and validation of data',
  },
  corrections: {
    title: 'Corrections and corrective actions',
  },
  documentation: {
    title: 'Documentation',
  },
  outsourcedActivities: {
    title: 'Outsourced Activities',
  },
  variationRegulatorDecision: {
    title: 'Update control activities',
  },
  decision: {
    title: 'Review control activities',
  },
};

export const dataGapsMap: SubTaskListMap<{
  dataGapsMethod: string;
  variationRegulatorDecision: string;
  decision: string;
}> = {
  title: 'Data gaps',
  dataGapsMethod: {
    title: 'Methods to be used to treat data gaps',
  },
  variationRegulatorDecision: {
    title: 'Update data gaps',
  },
  decision: {
    title: 'Review data gaps',
  },
};

export const greenhouseGasMap: SubTaskListMap<
  EmpMonitoringGreenhouseGas & { variationRegulatorDecision: string; decision: string }
> = {
  title: 'Procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
  fuel: {
    title: 'Determining fuel bunkered and fuel in tanks',
  },
  crossChecks: {
    title: 'Bunkering cross-checks',
  },
  voyages: {
    title: 'Recording and safeguarding completeness of voyages',
  },
  information: {
    title: 'Recording, retrieving, transmitting and storing information',
  },
  qaEquipment: {
    title: 'Ensuring quality assurance of measuring equipment',
  },
  variationRegulatorDecision: {
    title: 'Update procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
  },
  decision: {
    title: 'Review procedures related to the monitoring of greenhouse gas emissions and fuel consumption',
  },
};

export const emissionSourcesMap: SubTaskListMap<
  EmpEmissionSources & {
    variationRegulatorDecision: string;
    decision: string;
  }
> = {
  title: 'Procedures related to emissions sources and emissions factors',
  listCompletion: {
    title: 'Manage the completeness of the list of ships and emission sources',
  },
  emissionFactors: {
    title: 'Determination of emission factors',
  },
  emissionCompliance: {
    title: 'Compliance with sustainability criteria and greenhouse gas emission saving criteria',
  },
  variationRegulatorDecision: {
    title: 'Update procedures related to emissions sources and emissions factors',
  },
  decision: {
    title: 'Review procedures related to emissions sources and emissions factors',
  },
};

export const emissionsSubTasksMap: SubTaskListMap<
  EmpEmissions & {
    uploadShips: string;
    variationRegulatorDecision: string;
    decision: string;
  }
> = {
  ...emissionsSubtaskMap,
  variationRegulatorDecision: {
    title: 'Update list of ships and calculation of maritime emissions',
  },
  decision: {
    title: 'Review list of ships and calculation of maritime emissions',
  },
};

export const emissionShipSubtasksMap: SubTaskListMap<EmpShipEmissions> = {
  ...emissionsShipSubtaskMap,
  measurements: {
    title: 'Description of the measurement instruments involved',
  },
  carbonCapture: {
    title: 'Application of carbon capture and storage technologies',
  },
  exemptionConditions: {
    title: 'Conditions of exemption from per voyage monitoring and reporting',
  },
};

export const variationDetailsSubtaskMap: SubTaskListMap<
  Pick<EmpVariationTaskPayload, 'empVariationDetails'> &
    Pick<EmpVariationRegulatorTaskPayload, 'reasonRegulatorLed'> & {
      decision: string;
      summary: string;
    }
> = {
  title: 'Variation details',
  empVariationDetails: {
    title: 'Describe the changes',
  },
  reasonRegulatorLed: {
    title: 'Choose a reason to include in the notice',
  },
  decision: {
    title: 'Review the changes',
  },
  summary: {
    title: 'Enter a summary of the changes for emissions monitoring plan variation log',
  },
};

export const regulatorCommentsSubtaskMap: SubTaskListMap<{ requestedChanges: boolean }> = {
  title: 'Regulator comments',
  requestedChanges: {
    title: 'Changes requested by the regulator',
  },
};
