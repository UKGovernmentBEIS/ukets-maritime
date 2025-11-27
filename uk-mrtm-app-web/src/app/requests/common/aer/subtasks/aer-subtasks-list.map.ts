import {
  emissionsShipSubtaskMap,
  emissionsSubtaskMap,
} from '@requests/common/components/emissions/emissions-subtask-list.map';
import { SubTaskListMap } from '@shared/types';

export const reportingObligationMap: SubTaskListMap<{
  heading: string;
  introHint: string;
  reportingRequired: string;
  noReportingReason: string;
  supportingDocuments: string;
  uploadedFiles: string;
}> = {
  title: 'Reporting obligation',
  heading: {
    title: 'Reporting obligation requirement',
  },
  introHint: {
    title: 'You must submit an emissions report for the scheme year if you have performed a maritime activity.',
  },
  reportingRequired: {
    title: 'Are you required to submit an annual emissions report?',
  },
  noReportingReason: {
    title: 'Explain why you do not need to submit a report',
  },
  supportingDocuments: {
    title: 'Upload supporting documents (optional)',
  },
  uploadedFiles: {
    title: 'Uploaded files',
  },
};

export const monitoringPlanChangesMap: SubTaskListMap<{
  heading: string;
  changesExist: string;
  changes: string;
}> = {
  title: 'Monitoring plan changes',
  heading: {
    title: 'Changes to the emissions monitoring plan',
  },
  changesExist: {
    title: 'Were there any changes to the emissions monitoring plan during the scheme year?',
  },
  changes: {
    title: 'Describe the changes',
  },
};

export const aerEmissionsMap: SubTaskListMap<{
  ships: string;
  fetchFromEMP: string;
  uploadShips: string;
}> = {
  ...emissionsSubtaskMap,
  fetchFromEMP: {
    title: 'Import ships from EMP',
  },
  title: 'Ships and emission details list',
};

export const aerEmissionsShipMap: SubTaskListMap<{
  details: string;
  fuelsAndEmissionsFactors: string;
  emissionsSources: string;
  derogations: string;
}> = {
  ...emissionsShipSubtaskMap,
  derogations: { title: 'Do you have an exemption from per voyage monitoring?' },
};

export const aerTotalEmissionsMap = {
  title: 'Emissions summary for all ships',
};
