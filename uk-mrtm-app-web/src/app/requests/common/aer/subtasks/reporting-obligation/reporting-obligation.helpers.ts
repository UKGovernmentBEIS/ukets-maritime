export const REPORTING_OBLIGATION_SUB_TASK = 'reportingObligation';

export const REPORTING_OBLIGATION_SUB_TASK_PATH = 'reporting-obligation';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';

export enum ReportingObligationWizardStep {
  FORM = 'requirement',
  SUMMARY = '../',
}

export const isWizardCompleted = (payload: AerSubmitTaskPayload): boolean => {
  const { reportingRequired, reportingObligationDetails } = payload;
  return reportingRequired === true || (reportingRequired === false && !!reportingObligationDetails?.noReportingReason);
};
