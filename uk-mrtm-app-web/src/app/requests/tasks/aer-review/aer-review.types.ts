import { Type } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';

import {
  AerApplicationReviewRequestTaskPayload,
  AerDataReviewDecision,
  AerSaveReviewGroupDecisionRequestTaskActionPayload,
  ReviewDecisionDetails,
} from '@mrtm/api';

export interface AerReviewTaskPayload extends AerApplicationReviewRequestTaskPayload {
  currentGroup?: {
    group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group'];
    decision: AerDataReviewDecision;
  };
}

export type ReviewApplicationFormModel = Omit<AerDataReviewDecision, 'details'> &
  ReviewDecisionDetails & {
    group: AerSaveReviewGroupDecisionRequestTaskActionPayload['group'];
    requiredChanges?: Array<{
      reason: string;
      files: Array<{ file: File; uuid: string }>;
    }>;
  };

export interface RequiredChangeFormModel {
  reason: FormControl<string | null>;
  files: FormControl<{ file: File; uuid: string }[]>;
}

export type ReviewApplicationFormGroupModel = FormGroup<
  Record<keyof Omit<ReviewApplicationFormModel, 'requiredChanges'>, FormControl> & {
    requiredChanges: FormArray<FormGroup<RequiredChangeFormModel>>;
  }
>;

export interface AerReviewSummaryDetailsSection {
  component: Type<unknown>;
  inputs?: Record<string, unknown>;
}
