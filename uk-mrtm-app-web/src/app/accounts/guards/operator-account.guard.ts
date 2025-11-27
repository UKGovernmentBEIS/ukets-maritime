import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivateFn } from '@angular/router';

import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';

import { AccountReportingStatusHistoryService, MaritimeAccountsService } from '@mrtm/api';

import { OperatorAccountsStore, selectReportingStatus } from '@accounts/store';

export const canActivateOperatorAccount = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const store = inject(OperatorAccountsStore);
  const accountService = inject(MaritimeAccountsService);
  const reportingStatusService = inject(AccountReportingStatusHistoryService);
  const accountId = Number(route.paramMap.get('accountId'));

  return store.pipe(selectReportingStatus).pipe(
    switchMap((reportingStatus) =>
      combineLatest([
        accountService.getMaritimeAccount(accountId),
        reportingStatusService.getAllReportingStatuses(
          accountId,
          reportingStatus.paging.page - 1,
          reportingStatus.paging.pageSize,
        ),
      ]),
    ),
    tap(([account, reportingStatuses]) => {
      store.setCurrentAccount(account);
      store.setReportingStatuses((reportingStatuses as any)?.reportingStatusList);
      store.setReportingStatusTotal((reportingStatuses as any)?.total);
    }),
    map(([account]) => !!account),
  );
};

export const canDeactivateOperatorAccount: CanDeactivateFn<Observable<boolean>> = () => {
  const operatorAccountsStore = inject(OperatorAccountsStore);
  operatorAccountsStore.reset();

  return of(true);
};
