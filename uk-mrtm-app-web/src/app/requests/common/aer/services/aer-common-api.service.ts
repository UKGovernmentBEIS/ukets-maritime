import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { RequestTaskActionProcessDTO } from '@mrtm/api';

import {
  BusinessErrorService,
  catchBadRequest,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import {
  aerSubmitGenericError,
  aerSubmitNoVerificationPerformedError,
  aerSubmitValidationError,
} from '@requests/common/aer/errors';
import { mapAerToSavePayload } from '@requests/common/aer/services/aer-common-api.helpers';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class AerCommonApiService extends TaskApiService<AerSubmitTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'AER_APPLICATION_AMENDS_SUBMIT':
        return {
          actionType: 'AER_SAVE_APPLICATION_AMEND',
          actionPayloadType: 'AER_SAVE_APPLICATION_AMEND_PAYLOAD',
        };
      case 'AER_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'AER_SAVE_APPLICATION',
          actionPayloadType: 'AER_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'AER_APPLICATION_AMENDS_SUBMIT':
        return {
          actionType: 'AER_SUBMIT_APPLICATION_AMEND',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
      case 'AER_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'AER_SUBMIT_APPLICATION',
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

  submitForVerification(): Observable<void> {
    return this.handleSubmit({
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'AER_REQUEST_VERIFICATION',
      requestTaskActionPayload: { payloadType: 'EMPTY_PAYLOAD' },
    });
  }

  protected handleSubmit(submitAction: RequestTaskActionProcessDTO): Observable<void> {
    return this.service.processRequestTaskAction(submitAction).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
      catchBadRequest(ErrorCodes.FORM1001, () => {
        const taskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
        const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();
        const year = this.store.select(aerCommonQuery.selectReportingYear)();
        return this.businessErrorService.showError(aerSubmitValidationError(taskId, taskType, year));
      }),
      catchBadRequest(ErrorCodes.REQUEST_TASK_ACTION1000, (error) => {
        const taskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
        const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();
        const year = this.store.select(aerCommonQuery.selectReportingYear)();

        return error?.error?.data?.includes('NO_VERIFICATION_PERFORMED')
          ? this.businessErrorService.showError(aerSubmitNoVerificationPerformedError(taskId, taskType, year))
          : this.businessErrorService.showError(aerSubmitGenericError(taskId, taskType, year));
      }),
    );
  }

  fetchShipsFromEMP(): Observable<AerSubmitTaskPayload> {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();

    return this.service
      .processRequestTaskAction({
        requestTaskId,
        requestTaskActionType: 'AER_FETCH_EMP_LIST_OF_SHIPS',
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

  private createSaveAction(payload: AerSubmitTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { aer, aerSectionsCompleted, reportingRequired, reportingObligationDetails } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        reportingRequired,
        reportingObligationDetails,
        aer: reportingRequired ? mapAerToSavePayload(aer) : undefined,
        aerSectionsCompleted,
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
}
