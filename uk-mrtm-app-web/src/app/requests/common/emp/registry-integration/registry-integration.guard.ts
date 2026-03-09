import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn, createUrlTreeFromSnapshot, UrlTree } from '@angular/router';

import { map, Observable, switchMap, tap } from 'rxjs';

import { MaritimeAccountsService } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { OperatorAccountsStore } from '@accounts/store';
import { REGISTRY_INTEGRATION_TASK_NAME } from '@requests/common/emp/registry-integration/registry-integration.constants';

export const canActivateRegistry = (route: ActivatedRouteSnapshot): UrlTree | Observable<boolean> => {
  const requestTaskStore = inject(RequestTaskStore);
  const maritimeAccountsService = inject(MaritimeAccountsService);
  const operatorAccountsStore = inject(OperatorAccountsStore);
  const taskActions = requestTaskStore.select(requestTaskQuery.selectAllowedRequestTaskActions)();

  if (!taskActions.includes(REGISTRY_INTEGRATION_TASK_NAME)) {
    return createUrlTreeFromSnapshot(route, ['/dashboard']);
  }
  return requestTaskStore.rxSelect(requestTaskQuery.selectRequestInfo).pipe(
    switchMap((requestInfo) => {
      return maritimeAccountsService.getMaritimeAccount(requestInfo.accountId).pipe(
        tap((account) => operatorAccountsStore.setCurrentAccount(account)),
        map((account) => !!account),
      );
    }),
  );
};

export const canDeactivateRegistry: CanDeactivateFn<unknown> = () => {
  inject(OperatorAccountsStore).resetCurrentAccount();
  return true;
};
