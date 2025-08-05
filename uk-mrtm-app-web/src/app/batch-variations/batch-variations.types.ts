import { InjectionToken } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import {
  EmpBatchReissueRequestCreateActionPayload,
  EmpBatchReissuesResponseDTO,
  RequestDetailsDTO,
  RequestMetadata,
} from '@mrtm/api';

export interface EmpBatchReissueItemResponseDTO extends Omit<RequestDetailsDTO, 'requestMetadata'> {
  requestMetadata?: RequestMetadata & {
    submissionDate?: string;
    submitter?: string;
    submitterId?: string;
    summary?: string;
    accountsReports?: Record<string, string>;
  };
}

export interface BatchVariationState extends Omit<EmpBatchReissuesResponseDTO, 'requestDetails'> {
  requestDetails?: Array<EmpBatchReissueItemResponseDTO>;
  page?: number;
  currentItem?: EmpBatchReissueRequestCreateActionPayload;
}

export interface EmpBatchVariationTableItemDTO {
  id: string;
  createdBy: string;
  createdDate: string;
  emitters: number;
}

export const BATCH_VARIATION_FORM = new InjectionToken<UntypedFormGroup>('Batch variation form');
