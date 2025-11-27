import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router } from '@angular/router';

import { catchError, combineLatest, iif, map, Observable, of, switchMap } from 'rxjs';

import { RequestActionsService, RequestDetailsDTO, RequestItemsService, RequestsService } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { WorkflowStore } from '@requests/workflows/+state/workflow.store';
import { MrtmRequestType } from '@shared/types';

export const getWorkflowCanActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  if (!route.paramMap.has('workflowId')) {
    console.warn(`No :workflowId param in route`);
    return true;
  }

  const router = inject(Router);
  const workflowId = route.paramMap.get('workflowId');
  const store = inject(WorkflowStore);
  const requestsService = inject(RequestsService);
  const requestActionsService = inject(RequestActionsService);
  const requestItemsService = inject(RequestItemsService);
  const authStore = inject(AuthStore);
  const roleType = authStore.select(selectUserRoleType)();

  return combineLatest([
    requestsService.getRequestDetailsById(workflowId),
    requestActionsService.getRequestActionsByRequestId(workflowId),
    requestItemsService.getItemsByRequest(workflowId),
  ]).pipe(
    switchMap(([details, actions, items]) =>
      aerRelatedTasks(requestsService, details, roleType).pipe(
        map((aerRelatedTasks) => ({ details, actions, items, aerRelatedTasks })),
      ),
    ),
    map(({ details, actions, items, aerRelatedTasks }) => {
      store.setState({
        details,
        actions,
        tasks: items?.items,
        aerRelatedTasks: aerRelatedTasks?.length > 0 ? aerRelatedTasks : null,
      });

      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['dashboard']));
    }),
  );
};

const aerRelatedTasks = (
  requestsService: RequestsService,
  requestDetailsDTO: RequestDetailsDTO,
  userRoleType: string,
): Observable<MrtmRequestType[]> =>
  iif(
    () => userRoleType === 'REGULATOR' && requestDetailsDTO.requestType === 'AER',
    requestsService.getAvailableAerWorkflows(requestDetailsDTO.id),
    of({}),
  ).pipe(
    map((availableCreateActions) =>
      Object.keys(availableCreateActions).filter((createActionType) => availableCreateActions[createActionType]?.valid),
    ),
  );

export const getWorkflowCanDeactivateGuard: CanDeactivateFn<unknown> = () => {
  inject(WorkflowStore).reset();
  return true;
};
