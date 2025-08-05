import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable, throwError } from 'rxjs';

import { EmpVariationSaveApplicationRequestTaskActionPayload, RequestTaskActionProcessDTO } from '@mrtm/api';

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

import { EmpVariationAmendTaskPayload } from '@requests/common/emp';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class EmpAmendVariationApiService extends TaskApiService<EmpVariationAmendTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();
    switch (taskType) {
      case 'EMP_VARIATION_AMEND':
      default:
        return {
          actionType: 'EMP_VARIATION_SAVE_APPLICATION_AMEND',
          actionPayloadType: 'EMP_VARIATION_SAVE_APPLICATION_AMEND_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'EMP_VARIATION_AMEND':
      default:
        return {
          actionType: 'EMP_VARIATION_SUBMIT_APPLICATION_AMEND',
          actionPayloadType: 'EMPTY_PAYLOAD',
        };
    }
  }

  public save(payload: EmpVariationAmendTaskPayload): Observable<EmpVariationAmendTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(payload)).pipe(
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

  submit(): Observable<void> {
    return this.service.processRequestTaskAction(this.createSubmitAction()).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
    );
  }

  private createSaveAction(payload: EmpVariationSaveApplicationRequestTaskActionPayload): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.saveActionTypes;
    const { empVariationDetails, empVariationDetailsCompleted, empSectionsCompleted, emissionsMonitoringPlan } =
      payload;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        empVariationDetails,
        empVariationDetailsCompleted,
        empSectionsCompleted,
        emissionsMonitoringPlan,
        updatedSubtasks: (payload as any)?.updatedSubtasks ?? [],
        payloadType: actionPayloadType,
      },
    } as RequestTaskActionProcessDTO;
  }

  private createSubmitAction(): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.submitActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
      },
    } as RequestTaskActionProcessDTO;
  }
}
