import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { AerSaveApplicationVerificationRequestTaskActionPayload, RequestTaskActionProcessDTO } from '@mrtm/api';

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
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitValidationError } from '@requests/tasks/aer-verification-submit/errors';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class AerVerificationSubmitApiService extends TaskApiService<AerVerificationSubmitTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'AER_APPLICATION_VERIFICATION_SUBMIT':
      default:
        return {
          actionType: 'AER_SAVE_APPLICATION_VERIFICATION',
          actionPayloadType: 'AER_SAVE_APPLICATION_VERIFICATION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'AER_APPLICATION_VERIFICATION_SUBMIT':
      default:
        return {
          actionType: 'AER_SUBMIT_APPLICATION_VERIFICATION',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  private get importThirdPartyDataActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'AER_APPLICATION_VERIFICATION_SUBMIT':
      default:
        return {
          actionType: 'AER_VERIFICATION_IMPORT_THIRD_PARTY_DATA_APPLICATION',
          actionPayloadType: 'AER_VERIFICATION_IMPORT_THIRD_PARTY_DATA_APPLICATION_PAYLOAD',
        };
    }
  }

  save(payload: AerVerificationSubmitTaskPayload): Observable<AerVerificationSubmitTaskPayload> {
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
    return this.service.processRequestTaskAction(this.createSubmitAction()).pipe(
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
        return this.businessErrorService.showError(aerVerificationSubmitValidationError(taskId, taskType, year));
      }),
    );
  }

  private createSaveAction(payload: AerVerificationSubmitTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { verificationSectionsCompleted, verificationReport } = payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;
    const requestTaskActionPayload: AerSaveApplicationVerificationRequestTaskActionPayload = {
      payloadType: actionPayloadType,
      verificationSectionsCompleted,
      ...verificationReport,
    };

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload,
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

  importThirdPartyData(payload: AerVerificationSubmitTaskPayload): Observable<AerVerificationSubmitTaskPayload> {
    return this.service.processRequestTaskAction(this.createImportThirdPartyDataAction(payload)).pipe(
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
        return this.businessErrorService.showError(aerVerificationSubmitValidationError(taskId, taskType, year));
      }),
    );
  }

  private createImportThirdPartyDataAction(payload: AerVerificationSubmitTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { verificationSectionsCompleted } = payload;
    const { actionType, actionPayloadType } = this.importThirdPartyDataActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: { payloadType: actionPayloadType, verificationSectionsCompleted },
    } as RequestTaskActionProcessDTO;
  }
}
