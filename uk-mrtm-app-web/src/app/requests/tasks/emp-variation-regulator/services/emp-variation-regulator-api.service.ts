import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import {
  EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload,
  EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload,
  RequestTaskActionProcessDTO,
} from '@mrtm/api';

import { BusinessErrorService, ErrorCodes, taskNotFoundError } from '@netz/common/error';
import { TaskApiService } from '@netz/common/forms';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery } from '@netz/common/store';

import { EmpVariationRegulatorTaskPayload } from '@requests/common/emp';

@Injectable()
export class EmpVariationRegulatorApiService extends TaskApiService<EmpVariationRegulatorTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  public save(payload: EmpVariationRegulatorTaskPayload): Observable<EmpVariationRegulatorTaskPayload> {
    const requestTaskActionProcessDTO: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload;
    } = {
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'EMP_VARIATION_SAVE_APPLICATION_REGULATOR_LED',
      requestTaskActionPayload: {
        payloadType: 'EMP_VARIATION_SAVE_APPLICATION_REGULATOR_LED_PAYLOAD',
        emissionsMonitoringPlan: payload.emissionsMonitoringPlan,
        empVariationDetails: payload.empVariationDetails,
        empVariationDetailsCompleted: payload.empVariationDetailsCompleted,
        empSectionsCompleted: payload.empSectionsCompleted,
        reasonRegulatorLed: payload.reasonRegulatorLed,
      },
    };
    return this.processTaskAction(requestTaskActionProcessDTO, payload);
  }

  public saveVariationRegulatorDecision(
    payload: EmpVariationRegulatorTaskPayload,
    group: EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload['group'],
  ) {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const requestPayload: RequestTaskActionProcessDTO & {
      requestTaskActionPayload: EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload;
    } = {
      requestTaskId,
      requestTaskActionType: 'EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION_REGULATOR_LED',
      requestTaskActionPayload: {
        payloadType: 'EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION_REGULATOR_LED_PAYLOAD',
        group: group,
        decision: payload.reviewGroupDecisions[group],
        empSectionsCompleted: payload.empSectionsCompleted,
      },
    };
    return this.processTaskAction(requestPayload, payload);
  }

  submit(): Observable<void> {
    return throwError(() => new Error('Not yet implemented'));
  }

  private processTaskAction(
    requestTaskActionProcessDTO: RequestTaskActionProcessDTO,
    payload: EmpVariationRegulatorTaskPayload,
  ) {
    return this.service.processRequestTaskAction(requestTaskActionProcessDTO).pipe(
      map(() => payload),
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
