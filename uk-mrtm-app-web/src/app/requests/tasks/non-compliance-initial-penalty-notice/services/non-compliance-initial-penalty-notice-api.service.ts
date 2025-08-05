import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import {
  NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { SaveActionTypes } from '@shared/types';

@Injectable()
export class NonComplianceInitialPenaltyNoticeApiService extends TaskApiService<NonComplianceInitialPenaltyNoticeRequestTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'NON_COMPLIANCE_INITIAL_PENALTY_NOTICE':
      default:
        return {
          actionType: 'NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_SAVE_APPLICATION',
          actionPayloadType: 'NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_SAVE_APPLICATION_PAYLOAD',
        };
    }
  }

  save(
    payload: NonComplianceInitialPenaltyNoticeRequestTaskPayload,
  ): Observable<NonComplianceInitialPenaltyNoticeRequestTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    ) as Observable<NonComplianceInitialPenaltyNoticeRequestTaskPayload>;
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }

  private createSaveAction(payload: NonComplianceInitialPenaltyNoticeRequestTaskPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;
    const { initialPenaltyNotice, comments, sectionsCompleted } = payload;

    const requestTaskActionPayload: NonComplianceInitialPenaltyNoticeSaveApplicationRequestTaskActionPayload = {
      payloadType: actionPayloadType,
      initialPenaltyNotice,
      comments,
      sectionsCompleted,
    };

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload,
    } as RequestTaskActionProcessDTO;
  }
}
