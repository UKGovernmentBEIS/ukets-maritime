import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  AerSaveReviewGroupDecisionRequestTaskActionPayload,
  AerSkipReviewDecision,
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

import { AerReviewTaskPayload } from '@requests/tasks/aer-review/aer-review.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class AerReviewApiService extends TaskApiService<AerReviewTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'AER_APPLICATION_REVIEW':
      default:
        return {
          actionType: 'AER_SAVE_REVIEW_GROUP_DECISION',
          actionPayloadType: 'AER_SAVE_REVIEW_GROUP_DECISION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();
    switch (taskType) {
      case 'AER_APPLICATION_REVIEW':
      default:
        return {
          actionType: 'AER_COMPLETE_REVIEW',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  save(payload: AerReviewTaskPayload): Observable<AerReviewTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  submit(): Observable<void> {
    return this.service.processRequestTaskAction(this.createSubmitAction()).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  skipReview(payload: AerSkipReviewDecision): Observable<void> {
    return this.service.processRequestTaskAction(this.createSkipReviewAction(payload)).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  sendForAmends(): Observable<void> {
    return this.service.processRequestTaskAction(this.createSendForAmendsAction()).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      this.pendingRequestService.trackRequest(),
    );
  }

  private createSaveAction(payload: AerReviewTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { currentGroup, aerSectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        sectionsCompleted: aerSectionsCompleted,
        group: currentGroup.group,
        decision: currentGroup.decision,
      } as AerSaveReviewGroupDecisionRequestTaskActionPayload,
    } as RequestTaskActionProcessDTO;
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.submitActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
      },
    } as RequestTaskActionProcessDTO;
  }

  private createSkipReviewAction(payload: AerSkipReviewDecision): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return {
      requestTaskId,
      requestTaskActionType: 'AER_SKIP_REVIEW',
      requestTaskActionPayload: {
        ...payload,
        payloadType: 'AER_SKIP_REVIEW_PAYLOAD',
      },
    } as RequestTaskActionProcessDTO;
  }

  private createSendForAmendsAction(): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return {
      requestTaskId,
      requestTaskActionType: 'AER_REVIEW_RETURN_FOR_AMENDS',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      },
    } as RequestTaskActionProcessDTO;
  }
}
