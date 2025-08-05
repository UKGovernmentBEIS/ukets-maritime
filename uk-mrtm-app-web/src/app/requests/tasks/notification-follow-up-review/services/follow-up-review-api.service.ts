import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import {
  EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

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

import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class FollowUpReviewApiService extends TaskApiService<FollowUpReviewTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  save(payload: FollowUpReviewTaskPayload): Observable<FollowUpReviewTaskPayload> {
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
      case 'EMP_NOTIFICATION_FOLLOW_UP_APPLICATION_REVIEW':
      default:
        return {
          actionType: 'EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION',
          actionPayloadType: 'EMP_NOTIFICATION_FOLLOW_UP_SAVE_REVIEW_DECISION_PAYLOAD',
        };
    }
  }

  private createSaveAction(
    payload: EmpNotificationFollowUpSaveReviewDecisionRequestTaskActionPayload,
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
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return this.service
      .processRequestTaskAction({
        requestTaskId,
        requestTaskActionType: 'EMP_NOTIFICATION_FOLLOW_UP_RETURN_FOR_AMENDS',
        requestTaskActionPayload: {
          payloadType: 'EMPTY_PAYLOAD',
        },
      })
      .pipe(
        this.pendingRequestService.trackRequest(),
        catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
        ),
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
      );
  }
}
