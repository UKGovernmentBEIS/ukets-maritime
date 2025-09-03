import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

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

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class VirSubmitApiService extends TaskApiService<VirSubmitTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'VIR_SAVE_APPLICATION':
      default:
        return {
          actionType: 'VIR_SAVE_APPLICATION',
          actionPayloadType: 'VIR_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'VIR_SAVE_APPLICATION':
      default:
        return {
          actionType: 'VIR_SUBMIT_APPLICATION',
          actionPayloadType: 'EMPTY_PAYLOAD',
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
    return this.handleSubmit(this.createSubmitAction());
  }

  private createSaveAction(payload: VirSubmitTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { operatorImprovementResponses, sectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        operatorImprovementResponses,
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
      requestTaskActionPayload: { payloadType: actionPayloadType },
    } as RequestTaskActionProcessDTO;
  }

  private handleSubmit(submitAction: RequestTaskActionProcessDTO): Observable<void> {
    return this.service.processRequestTaskAction(submitAction).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
    );
  }
}
