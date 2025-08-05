import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import { NonComplianceSaveApplicationRequestTaskActionPayload, RequestTaskActionProcessDTO } from '@mrtm/api';

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

import { NonComplianceSubmitTaskPayload } from '@requests/common/non-compliance';
import { nonComplianceSubmitValidationError } from '@requests/tasks/non-compliance-submit/errors';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class NonComplianceSubmitApiService extends TaskApiService<NonComplianceSubmitTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NON_COMPLIANCE_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'NON_COMPLIANCE_SAVE_APPLICATION',
          actionPayloadType: 'NON_COMPLIANCE_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NON_COMPLIANCE_APPLICATION_SUBMIT':
      default:
        return {
          actionType: 'NON_COMPLIANCE_SUBMIT_APPLICATION',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  save(payload: NonComplianceSubmitTaskPayload): Observable<NonComplianceSubmitTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    ) as Observable<NonComplianceSubmitTaskPayload>;
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
        return this.businessErrorService.showError(nonComplianceSubmitValidationError(taskId));
      }),
    );
  }

  private createSaveAction(payload: NonComplianceSubmitTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;
    const {
      reason,
      selectedRequests,
      nonComplianceDate,
      complianceDate,
      comments,
      civilPenalty,
      noCivilPenaltyJustification,
      noticeOfIntent,
      initialPenalty,
      sectionsCompleted,
    } = payload;

    const requestTaskActionPayload: NonComplianceSaveApplicationRequestTaskActionPayload = {
      payloadType: actionPayloadType,
      reason,
      selectedRequests,
      nonComplianceDate,
      complianceDate,
      comments,
      civilPenalty,
      noCivilPenaltyJustification,
      noticeOfIntent,
      initialPenalty,
      sectionsCompleted,
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
}
