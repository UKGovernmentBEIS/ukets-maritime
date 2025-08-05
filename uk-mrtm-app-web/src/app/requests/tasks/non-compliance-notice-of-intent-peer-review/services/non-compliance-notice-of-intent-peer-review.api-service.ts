import { inject } from '@angular/core';

import { Observable } from 'rxjs';

import { RequestTaskActionProcessDTO } from '@mrtm/api';

import {
  BusinessErrorService,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload } from '@requests/tasks/non-compliance-notice-of-intent-peer-review/non-compliance-notice-of-intent-peer-review.types';

export class NonComplianceNoticeOfIntentPeerReviewApiService extends TaskApiService<NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload> {
  private readonly pendingRequestService: PendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService: BusinessErrorService = inject(BusinessErrorService);

  save(
    payload: NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload,
  ): Observable<NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      this.pendingRequestService.trackRequest(),
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
    );
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }

  private createSaveAction(
    payload: NonComplianceNoticeOfIntentPeerReviewRequestTaskPayload,
  ): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return {
      requestTaskId,
      requestTaskActionType: 'NON_COMPLIANCE_NOTICE_OF_INTENT_SUBMIT_PEER_REVIEW_DECISION',
      requestTaskActionPayload: {
        payloadType: 'NON_COMPLIANCE_NOTICE_OF_INTENT_SUBMIT_PEER_REVIEW_DECISION_PAYLOAD',
        decision: payload.decision,
      },
    } as RequestTaskActionProcessDTO;
  }
}
