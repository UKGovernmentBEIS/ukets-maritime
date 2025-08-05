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

import { EmpPeerReviewTaskPayload } from '@requests/common/emp/emp.types';

export class EmpPeerReviewApiService extends TaskApiService<EmpPeerReviewTaskPayload> {
  private readonly pendingRequestService: PendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService: BusinessErrorService = inject(BusinessErrorService);

  public save(payload: EmpPeerReviewTaskPayload): Observable<EmpPeerReviewTaskPayload> {
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

  public submit(): Observable<any> {
    throw new Error('Method not implemented');
  }

  private createSaveAction(payload: EmpPeerReviewTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return {
      requestTaskId,
      requestTaskActionType: 'EMP_ISSUANCE_REVIEW_SUBMIT_PEER_REVIEW_DECISION',
      requestTaskActionPayload: {
        payloadType: 'EMP_ISSUANCE_REVIEW_SUBMIT_PEER_REVIEW_DECISION_PAYLOAD',
        decision: payload.decision,
      },
    } as RequestTaskActionProcessDTO;
  }
}
