import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, createUrlTreeFromSnapshot } from '@angular/router';

import { IMPORT_DATA_WIZARD_STEP } from '@api-data-management/api-data-management.constants';
import { ImportDataStore } from '@api-data-management/import-data/+state/import-data.store';
import { isNil } from '@shared/utils';

export const canActivateImportDataSummary: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(ImportDataStore);

  return (
    (store?.state?.items?.length && !isNil(store.state.requestType)) ||
    createUrlTreeFromSnapshot(route, [IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE])
  );
};

export const canActivateImportDataSuccess: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(ImportDataStore);

  return (
    (store?.state?.items?.length && !isNil(store.state.requestType)) ||
    createUrlTreeFromSnapshot(route, ['../', IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE])
  );
};

export const canActivateSelectAccountsStep: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store = inject(ImportDataStore);
  return (
    !isNil(store.state?.requestType) ||
    createUrlTreeFromSnapshot(route, ['../', IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE])
  );
};

export const canActivateImportData: CanActivateFn = () => {
  const store = inject(ImportDataStore);

  store.reset();
  return true;
};

export const canDeactivateImportData: CanDeactivateFn<any> = () => {
  const store = inject(ImportDataStore);

  store.reset();
  return true;
};
