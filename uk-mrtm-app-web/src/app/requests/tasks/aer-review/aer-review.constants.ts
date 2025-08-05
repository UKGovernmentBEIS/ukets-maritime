import { InjectionToken } from '@angular/core';

import {
  AerDataReviewDecision,
  AerReviewDecision,
  AerSaveReviewGroupDecisionRequestTaskActionPayload,
} from '@mrtm/api';

import { AerReviewSummaryDetailsSection } from '@requests/tasks/aer-review/aer-review.types';

export const AER_REVIEW_ROUTE_PREFIX = 'aer-review';
export const AER_REVIEW_OPERATOR_SIDE_ROUTE_PREFIX = 'operator-side';
export const AER_REVIEW_VERIFIER_SIDE_ROUTE_PREFIX = 'verifier-side';
export const AER_REVIEW_NO_OBLIGATION_ROUTE_PREFIX = 'no-obligation';
export const AER_REVIEW_TASK = ['AER_APPLICATION_REVIEW', 'AER_WAIT_FOR_AMENDS'];
export const AER_REVIEW_DATA_TYPE: InjectionToken<AerReviewDecision['reviewDataType']> = new InjectionToken(
  'AER_REVIEW_DATA_TYPE',
);
export const AER_REVIEW_SUBTASK: InjectionToken<string> = new InjectionToken('AER_REVIEW_SUBTASK');
export const AER_REVIEW_AVAILABLE_OPTIONS: InjectionToken<Array<AerDataReviewDecision['type']>> = new InjectionToken(
  'AER_REVIEW_AVAILABLE_OPTIONS',
);

export const AER_REVIEW_TASK_TITLE: InjectionToken<string> = new InjectionToken('AER_REVIEW_TASK_TITLE');
export const AER_REVIEW_GROUP: InjectionToken<AerSaveReviewGroupDecisionRequestTaskActionPayload['group']> =
  new InjectionToken('AER_REVIEW_GROUP');
export enum AerReviewWizardSteps {
  FORM = 'form',
  SUMMARY = '../',
}

export const AER_REVIEW_SUBTASK_DETAILS: InjectionToken<AerReviewSummaryDetailsSection> = new InjectionToken(
  'AER_REVIEW_SUBTASK_DETAILS',
);
