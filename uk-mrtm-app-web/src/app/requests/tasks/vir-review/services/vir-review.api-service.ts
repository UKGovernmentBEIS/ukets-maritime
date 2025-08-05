import { inject } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { RequestTaskActionProcessDTO } from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { VirReviewTaskPayload } from '@requests/tasks/vir-review/vir-review.types';
import { SaveActionTypes } from '@shared/types';

export class VirReviewApiService extends TaskApiService<VirReviewTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'VIR_SAVE_REVIEW':
      default:
        return {
          actionType: 'VIR_SAVE_REVIEW',
          actionPayloadType: 'VIR_SAVE_REVIEW_PAYLOAD',
        };
    }
  }

  save(payload: AerSubmitTaskPayload): Observable<AerSubmitTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }

  private createSaveAction(payload: VirReviewTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { regulatorReviewResponse, sectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        regulatorReviewResponse,
        sectionsCompleted,
      },
    } as RequestTaskActionProcessDTO;
  }
}
