import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { iif, map, of, switchMap } from 'rxjs';

import {
  ReportRelatedRequestCreateActionPayload,
  RequestCreateActionEmptyPayload,
  RequestCreateActionProcessDTO,
  RequestCreateActionProcessResponseDTO,
  RequestItemsService,
  RequestsService,
} from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { workflowsQuery, WorkflowStore } from '@requests/workflows/+state';

export const requestCreateActionGuard: CanActivateFn = (route) => {
  const workflowStore: WorkflowStore = inject(WorkflowStore);
  const authStore: AuthStore = inject(AuthStore);
  const requestsService: RequestsService = inject(RequestsService);
  const requestItemsService: RequestItemsService = inject(RequestItemsService);
  const router: Router = inject(Router);

  const { accountId, workflowId, requestCreateActionType } = route.params;
  const aerRelatedTasks = workflowStore.select(workflowsQuery.selectAerRelatedTasks)();
  const userRoleType = authStore.select(selectUserRoleType)();
  const fallbackUrlTree = router.parseUrl('/dashboard');

  return iif(
    () => userRoleType === 'REGULATOR' && aerRelatedTasks?.includes(requestCreateActionType),
    requestsService
      .processRequestCreateAction(createRequestCreateActionProcessDTO(requestCreateActionType, workflowId), accountId)
      .pipe(
        switchMap((response: RequestCreateActionProcessResponseDTO) =>
          requestItemsService.getItemsByRequest(response.requestId),
        ),
        map((data) => (data.totalItems === 1 ? router.parseUrl(`/tasks/${data.items[0].taskId}`) : fallbackUrlTree)),
      ),
    of(fallbackUrlTree),
  );
};

export const createRequestCreateActionProcessDTO = (
  requestType: RequestCreateActionProcessDTO['requestType'],
  requestId: string,
): RequestCreateActionProcessDTO => {
  switch (requestType) {
    case 'DOE':
      return {
        requestType,
        requestCreateActionPayload: {
          payloadType: 'REPORT_RELATED_REQUEST_CREATE_ACTION_PAYLOAD',
          requestId: requestId,
        } as ReportRelatedRequestCreateActionPayload,
      };
    default:
      return {
        requestType,
        requestCreateActionPayload: {
          payloadType: 'EMPTY_PAYLOAD',
        } as RequestCreateActionEmptyPayload,
      };
  }
};
