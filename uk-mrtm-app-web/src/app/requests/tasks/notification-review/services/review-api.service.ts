import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import { EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload, RequestTaskActionProcessDTO } from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { ReviewTaskPayload } from '@requests/common/emp/emp.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class ReviewApiService extends TaskApiService<ReviewTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  save(payload: ReviewTaskPayload): Observable<ReviewTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      map(() => payload),
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();
    switch (taskType) {
      case 'EMP_NOTIFICATION_APPLICATION_REVIEW':
      default:
        return {
          actionType: 'EMP_NOTIFICATION_SAVE_REVIEW_GROUP_DECISION',
          actionPayloadType: 'EMP_NOTIFICATION_SAVE_REVIEW_GROUP_DECISION_PAYLOAD',
        };
    }
  }

  private createSaveAction(
    payload: EmpNotificationSaveReviewGroupDecisionRequestTaskActionPayload,
  ): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { sectionsCompleted, reviewDecision } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        reviewDecision,
        sectionsCompleted,
      },
    } as RequestTaskActionProcessDTO;
  }

  submit(): Observable<void> {
    return throwError(() => new Error('Not yet implemented'));
  }
}
