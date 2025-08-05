import { inject } from '@angular/core';
import { CanActivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { map, tap } from 'rxjs';
import { isNil } from 'lodash-es';

import { AccountReportingStatusHistoryService } from '@mrtm/api';

import { AuthStore, selectUserRoleType } from '@netz/common/auth';

import { OperatorAccountsStore } from '@accounts/store';

export const canActivateEditReportingStatus: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const operatorAccountsStore = inject(OperatorAccountsStore);
  const reportingStatusService = inject(AccountReportingStatusHistoryService);

  const { reportingYear, accountId } = route.params;
  const userRole = authStore.select(selectUserRoleType)();

  if (userRole !== 'REGULATOR') {
    return false;
  }

  return reportingStatusService.getReportingStatusByYear(accountId, reportingYear).pipe(
    tap((result) => {
      operatorAccountsStore.setCurrentStatus(result as any);
    }),
    map((result) => !!result),
  );
};

export const canDeactivateEditReportingStatus: CanActivateFn = () => {
  const operatorAccountsStore = inject(OperatorAccountsStore);

  operatorAccountsStore.resetEditReportingStatus();

  return true;
};

export const canActivateEditReportingStatusSummary: CanActivateFn = (route) => {
  const operatorAccountsStore = inject(OperatorAccountsStore);

  return (
    !isNil(operatorAccountsStore.getState()?.currentAccount?.reportingStatus?.upsertStatus) ||
    createUrlTreeFromSnapshot(route, ['../'])
  );
};
