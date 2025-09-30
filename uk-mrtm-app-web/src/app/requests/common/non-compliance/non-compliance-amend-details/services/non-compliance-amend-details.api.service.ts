import { inject, Injectable } from '@angular/core';

import { map, Observable, tap } from 'rxjs';

import { NonComplianceAmendDetailsRequestTaskActionPayload, RequestActionsService } from '@mrtm/api';

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

import { NonComplianceUnionPayload } from '@requests/common/non-compliance/non-compliance.types';

@Injectable()
export class NonComplianceAmendDetailsApiService extends TaskApiService<NonComplianceUnionPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);
  private readonly requestActionsService = inject(RequestActionsService);

  save(payload: NonComplianceUnionPayload): Observable<any> {
    return this.service
      .processRequestTaskAction({
        requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
        requestTaskActionType: 'NON_COMPLIANCE_AMEND_DETAILS',
        requestTaskActionPayload: this.createAmendDetailsActionPayload(payload),
      })
      .pipe(
        map(() => payload),
        catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
        ),
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
        this.pendingRequestService.trackRequest(),
      );
  }

  updateTimeline(requestTaskId: string) {
    return this.requestActionsService
      .getRequestActionsByRequestId(requestTaskId)
      .pipe(tap((timeline) => this.store.setTimeline(timeline)));
  }

  private createAmendDetailsActionPayload(
    payload: NonComplianceUnionPayload,
  ): NonComplianceAmendDetailsRequestTaskActionPayload {
    return {
      payloadType: 'NON_COMPLIANCE_AMEND_DETAILS_PAYLOAD',
      reason: payload.reason,
      nonComplianceDate: payload.nonComplianceDate,
      complianceDate: payload.complianceDate,
      nonComplianceComments: payload.nonComplianceComments,
    };
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }
}
