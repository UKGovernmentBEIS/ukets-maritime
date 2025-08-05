import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import {
  EmpVariationSaveApplicationReviewRequestTaskActionPayload,
  EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload,
  EmpVariationSaveReviewDeterminationRequestTaskActionPayload,
  EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';

@Injectable()
export class EmpVariationReviewApiService extends TaskApiService<EmpVariationReviewTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  public save(payload: EmpVariationReviewTaskPayload): Observable<EmpVariationReviewTaskPayload> {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpVariationSaveApplicationReviewRequestTaskActionPayload;
    } = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_VARIATION_SAVE_APPLICATION_REVIEW',
      requestTaskActionPayload: {
        payloadType: 'EMP_VARIATION_SAVE_APPLICATION_REVIEW_PAYLOAD',
        emissionsMonitoringPlan: payload.emissionsMonitoringPlan,
        empSectionsCompleted: payload.empSectionsCompleted,
        empVariationDetails: payload.empVariationDetails,
        empVariationDetailsCompleted: payload.empVariationDetailsCompleted,
        empVariationDetailsReviewCompleted: payload.empVariationDetailsReviewCompleted,
      },
    };
    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  public saveReviewDecision(
    payload: EmpVariationReviewTaskPayload,
    group: EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload['group'],
  ) {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const requestPayload: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload;
    } = {
      requestTaskId,
      requestTaskActionType: 'EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION',
      requestTaskActionPayload: {
        payloadType: 'EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION_PAYLOAD',
        group,
        decision: payload.reviewGroupDecisions[group],
        empSectionsCompleted: payload.empSectionsCompleted,
      },
    };
    return this.processTaskAction(requestPayload, payload);
  }

  public saveVariationDetailsReviewDecision(payload: EmpVariationReviewTaskPayload) {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const requestPayload: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload;
    } = {
      requestTaskId,
      requestTaskActionType: 'EMP_VARIATION_SAVE_DETAILS_REVIEW_GROUP_DECISION',
      requestTaskActionPayload: {
        payloadType: 'EMP_VARIATION_SAVE_DETAILS_REVIEW_GROUP_DECISION_PAYLOAD',
        decision: payload.empVariationDetailsReviewDecision,
        empVariationDetailsReviewCompleted: payload.empVariationDetailsReviewCompleted,
        empVariationDetailsCompleted: payload.empVariationDetailsCompleted,
      },
    };

    return this.processTaskAction(requestPayload, payload);
  }

  public saveReviewDetermination(payload: EmpVariationReviewTaskPayload) {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpVariationSaveReviewDeterminationRequestTaskActionPayload;
    } = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_VARIATION_SAVE_REVIEW_DETERMINATION',
      requestTaskActionPayload: {
        payloadType: 'EMP_VARIATION_SAVE_REVIEW_DETERMINATION_PAYLOAD',
        determination: payload.determination,
        empSectionsCompleted: payload.empSectionsCompleted,
      },
    };
    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  public sendForAmends(payload: EmpVariationReviewTaskPayload) {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_VARIATION_REVIEW_RETURN_FOR_AMENDS',
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      },
    };

    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  submit(): Observable<void> {
    return throwError(() => new Error('Not yet implemented'));
  }

  private processTaskAction(
    requestTaskActionProcessDTO: RequestTaskActionProcessDTO,
    payload: EmpVariationReviewTaskPayload,
  ) {
    return this.service.processRequestTaskAction(requestTaskActionProcessDTO).pipe(
      map((res: EmpVariationReviewTaskPayload) => ({ ...payload, determination: res?.determination })),
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
