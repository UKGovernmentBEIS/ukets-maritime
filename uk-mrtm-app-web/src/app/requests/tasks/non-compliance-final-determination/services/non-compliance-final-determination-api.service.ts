import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import {
  NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

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

import { NonComplianceFinalDeterminationTaskPayload } from '@requests/common/non-compliance';
import { nonComplianceFinalDeterminationValidationError } from '@requests/tasks/non-compliance-final-determination/errors';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class NonComplianceFinalDeterminationApiService extends TaskApiService<NonComplianceFinalDeterminationTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NON_COMPLIANCE_FINAL_DETERMINATION':
      default:
        return {
          actionType: 'NON_COMPLIANCE_FINAL_DETERMINATION_SAVE_APPLICATION',
          actionPayloadType: 'NON_COMPLIANCE_FINAL_DETERMINATION_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NON_COMPLIANCE_FINAL_DETERMINATION':
      default:
        return {
          actionType: 'NON_COMPLIANCE_FINAL_DETERMINATION_SUBMIT_APPLICATION',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  save(payload: NonComplianceFinalDeterminationTaskPayload): Observable<NonComplianceFinalDeterminationTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    ) as Observable<NonComplianceFinalDeterminationTaskPayload>;
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
        return this.businessErrorService.showError(nonComplianceFinalDeterminationValidationError(taskId));
      }),
    );
  }

  private createSaveAction(payload: NonComplianceFinalDeterminationTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;
    const {
      complianceRestored,
      complianceRestoredDate,
      comments,
      reissuePenalty,
      operatorPaid,
      operatorPaidDate,
      sectionsCompleted,
    } = payload;

    const requestTaskActionPayload: NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload = {
      payloadType: actionPayloadType,
      complianceRestored,
      complianceRestoredDate,
      comments,
      reissuePenalty,
      operatorPaid,
      operatorPaidDate,
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
