import { RegulatorReviewResponse } from '@mrtm/api';

import { isNil } from '@shared/utils';

export enum VirReviewReportSummaryWizardStep {
  SUMMARY = '../',
  REPORT = 'report',
}

export const isWizardCompleted = (regulatorResponse: RegulatorReviewResponse): boolean =>
  !isNil(regulatorResponse?.reportSummary);
