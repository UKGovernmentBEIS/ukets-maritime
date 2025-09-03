import { inject, Injectable } from '@angular/core';

import { catchError, Observable, throwError } from 'rxjs';

import {
  RequestTaskActionProcessDTO,
  VirApplicationRespondToRegulatorCommentsRequestTaskPayload,
  VirSaveRespondToRegulatorCommentsRequestTaskActionPayload,
  VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload,
} from '@mrtm/api';

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

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_REGULATOR_SUBTASK } from '@requests/common/vir';
import { virRespondToRegulatorCommentsQuery } from '@requests/tasks/vir-respond-to-regulator-comments/+state';
import { VirRespondToRegulatorCommentsTaskPayload } from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.types';
import { SaveActionTypes } from '@shared/types';

@Injectable()
export class VirRespondToRegulatorApiService extends TaskApiService<VirRespondToRegulatorCommentsTaskPayload> {
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  private get saveActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'VIR_SAVE_APPLICATION':
      default:
        return {
          actionType: 'VIR_SAVE_RESPOND_TO_REGULATOR_COMMENTS',
          actionPayloadType: 'VIR_SAVE_RESPOND_TO_REGULATOR_COMMENTS_PAYLOAD',
        };
    }
  }

  private get submitActionTypes(): SaveActionTypes {
    const taskType = this.store.select(requestTaskQuery.selectRequestTaskType)();

    switch (taskType) {
      case 'VIR_RESPOND_TO_REGULATOR_COMMENTS':
      default:
        return {
          actionType: 'VIR_SUBMIT_RESPOND_TO_REGULATOR_COMMENTS',
          actionPayloadType: 'VIR_SUBMIT_RESPOND_TO_REGULATOR_COMMENTS_PAYLOAD',
        };
    }
  }

  save(
    payload: VirApplicationRespondToRegulatorCommentsRequestTaskPayload,
  ): Observable<VirApplicationRespondToRegulatorCommentsRequestTaskPayload> {
    throw new Error('Method not implemented.', { cause: payload });
  }

  submit(): Observable<void> {
    throw new Error('Method not implemented.');
  }

  submitOperatorImprovement(
    reference: VirSaveRespondToRegulatorCommentsRequestTaskActionPayload['reference'],
  ): Observable<void> {
    return this.handleSubmit(this.createSubmitAction(reference));
  }

  public saveOperatorImprovement(
    reference: VirSaveRespondToRegulatorCommentsRequestTaskActionPayload['reference'],
    payload: VirRespondToRegulatorCommentsTaskPayload,
  ): Observable<VirRespondToRegulatorCommentsTaskPayload> {
    return this.service.processRequestTaskAction(this.createSaveAction(reference, payload)).pipe(
      catchError((err) => {
        if (err.code === ErrorCodes.NOTFOUND1001) {
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError);
        }
        return throwError(() => err);
      }),
      this.pendingRequestService.trackRequest(),
    );
  }

  private createSaveAction(
    reference: VirSaveRespondToRegulatorCommentsRequestTaskActionPayload['reference'],
    payload: VirRespondToRegulatorCommentsTaskPayload,
  ): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { operatorImprovementFollowUpResponses, virRespondToRegulatorCommentsSectionsCompleted, sectionsCompleted } =
      payload;
    const { actionType, actionPayloadType } = this.saveActionTypes;

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        reference,
        operatorImprovementFollowUpResponse: operatorImprovementFollowUpResponses[reference],
        sectionsCompleted: {
          ...virRespondToRegulatorCommentsSectionsCompleted,
          ...sectionsCompleted,
        },
      },
    } as RequestTaskActionProcessDTO;
  }

  private createSubmitAction(
    reference: VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload['reference'],
  ): RequestTaskActionProcessDTO {
    const requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
    const { actionType, actionPayloadType } = this.submitActionTypes;
    const { sectionsCompleted } = this.store.select(virRespondToRegulatorCommentsQuery.selectPayload)();

    return {
      requestTaskId,
      requestTaskActionType: actionType,
      requestTaskActionPayload: {
        payloadType: actionPayloadType,
        reference,
        sectionsCompleted: {
          ...sectionsCompleted,
          [`${RESPOND_TO_REGULATOR_SUBTASK}-${reference}`]: TaskItemStatus.COMPLETED,
        },
      },
    } as RequestTaskActionProcessDTO;
  }

  private handleSubmit(submitAction: RequestTaskActionProcessDTO): Observable<void> {
    return this.service.processRequestTaskAction(submitAction).pipe(
      catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
        this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
      ),
      catchTaskReassignedBadRequest(() =>
        this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
      ),
    );
  }
}
