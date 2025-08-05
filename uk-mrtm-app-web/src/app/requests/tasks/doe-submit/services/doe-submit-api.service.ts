import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

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

import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class DoeSubmitApiService extends TaskApiService<DoeTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'DOE_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'DOE_SAVE_APPLICATION',
          actionPayloadType: 'DOE_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'DOE_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'DOE_SUBMIT_APPLICATION',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  save(payload: DoeTaskPayload): Observable<DoeTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
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

  private createSaveAction(payload: DoeTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { doe, sectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        doe,
        sectionsCompleted,
      },
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
}
