import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import {
  EmpIssuanceSaveApplicationReviewRequestTaskActionPayload,
  EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload,
  EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { EmpReviewTaskPayload } from '@requests/common';

@Injectable()
export class EmpReviewApiService extends TaskApiService<EmpReviewTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  public save(payload: EmpReviewTaskPayload): Observable<EmpReviewTaskPayload> {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpIssuanceSaveApplicationReviewRequestTaskActionPayload;
    } = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_ISSUANCE_SAVE_APPLICATION_REVIEW',
      requestTaskActionPayload: {
        payloadType: 'EMP_ISSUANCE_SAVE_APPLICATION_REVIEW_PAYLOAD',
        emissionsMonitoringPlan: payload.emissionsMonitoringPlan,
        empSectionsCompleted: payload.empSectionsCompleted,
      },
    };
    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  public saveReviewDecision(
    payload: EmpReviewTaskPayload,
    reviewGroup: EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload['reviewGroup'],
  ) {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const requestPayload: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload;
    } = {
      requestTaskId,
      requestTaskActionType: 'EMP_ISSUANCE_SAVE_REVIEW_GROUP_DECISION',
      requestTaskActionPayload: {
        payloadType: 'EMP_ISSUANCE_SAVE_REVIEW_GROUP_DECISION_PAYLOAD',
        reviewGroup: reviewGroup,
        decision: payload.reviewGroupDecisions[reviewGroup],
        empSectionsCompleted: payload.empSectionsCompleted,
      },
    };
    return this.processTaskAction(requestPayload, payload);
  }

  public saveReviewDetermination(payload: EmpReviewTaskPayload) {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload;
    } = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_ISSUANCE_SAVE_REVIEW_DETERMINATION',
      requestTaskActionPayload: {
        payloadType: 'EMP_ISSUANCE_SAVE_REVIEW_DETERMINATION_PAYLOAD',
        determination: payload.determination,
        empSectionsCompleted: payload.empSectionsCompleted,
      },
    };
    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  public sendForAmends(payload: EmpReviewTaskPayload) {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_ISSUANCE_REVIEW_RETURN_FOR_AMENDS',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      },
    };

    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  submit(): Observable<void> {
    return throwError(() => new Error('Not yet implemented'));
  }

  private processTaskAction(requestTaskActionProcessDTO: RequestTaskActionProcessDTO, payload: EmpReviewTaskPayload) {
    return this.service.processRequestTaskAction(requestTaskActionProcessDTO).pipe(
      map((res: EmpReviewTaskPayload) => ({ ...payload, determination: res?.determination })),
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }
}
