import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import {
  NonComplianceCivilPenaltyRequestTaskPayload,
  NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { SaveActionTypes } from '@shared/types';

@Injectable()
export class NonComplianceCivilPenaltyApiService extends TaskApiService<NonComplianceCivilPenaltyRequestTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NON_COMPLIANCE_CIVIL_PENALTY':
      default:
        return {
          actionType: 'NON_COMPLIANCE_CIVIL_PENALTY_SAVE_APPLICATION',
          actionPayloadType: 'NON_COMPLIANCE_CIVIL_PENALTY_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  save(payload: NonComplianceCivilPenaltyRequestTaskPayload): Observable<NonComplianceCivilPenaltyRequestTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    ) as Observable<NonComplianceCivilPenaltyRequestTaskPayload>;
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }

  private createSaveAction(payload: NonComplianceCivilPenaltyRequestTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;
    const { civilPenalty, comments, dueDate, penaltyAmount, sectionsCompleted } = payload;

    const requestTaskActionPayload: NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload = {
      payloadType: actionPayloadType,
      civilPenalty,
      comments,
      dueDate,
      penaltyAmount,
      sectionsCompleted,
    };

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload,
    } as RequestTaskActionProcessDTO;
  }
}
