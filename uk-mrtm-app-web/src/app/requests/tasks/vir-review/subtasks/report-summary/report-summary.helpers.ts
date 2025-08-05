import { isNil } from 'lodash-es';

import { RegulatorReviewResponse } from '@mrtm/api';

export enum VirReviewReportSummaryWizardStep {
  SUMMARY = '../',
  REPORT = 'report',
}

export const isWizardCompleted = (regulatorResponse: RegulatorReviewResponse): boolean =>
  !isNil(regulatorResponse?.reportSummary);
