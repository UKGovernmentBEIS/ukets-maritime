import { Routes } from '@angular/router';

import { IMPORT_DATA_WIZARD_STEP } from '@api-data-management/api-data-management.constants';
import {
  canActivateImportDataSuccess,
  canActivateImportDataSummary,
  canActivateSelectAccountsStep,
  canDeactivateImportData,
} from '@api-data-management/import-data/import-data.guard';

export const IMPORT_DATA_ROUTES: Routes = [
  {
    path: '',
    title: 'Import Data',
    canActivate: [canActivateImportDataSummary],
    data: {
      breadcrumb: false,
      backlink: `./${IMPORT_DATA_WIZARD_STEP.SELECT_OPERATOR_ACCOUNTS}`,
    },
    loadComponent: () =>
      import('@api-data-management/import-data/import-data-summary').then((c) => c.ImportDataSummaryComponent),
  },
  {
    path: IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@api-data-management/import-data/import-data-select-task-form').then(
        (c) => c.ImportDataSelectTaskFormComponent,
      ),
  },
  {
    path: IMPORT_DATA_WIZARD_STEP.SELECT_OPERATOR_ACCOUNTS,
    data: { breadcrumb: false, backlink: `../${IMPORT_DATA_WIZARD_STEP.SELECT_TASK_TYPE}` },
    canActivate: [canActivateSelectAccountsStep],
    loadComponent: () =>
      import('@api-data-management/import-data/import-data-select-operator-account-form').then(
        (c) => c.ImportDataSelectOperatorAccountFormComponent,
      ),
  },
  {
    path: IMPORT_DATA_WIZARD_STEP.SUCCESS,
    data: { breadcrumb: true },
    canActivate: [canActivateImportDataSuccess],
    canDeactivate: [canDeactivateImportData],
    loadComponent: () =>
      import('@api-data-management/import-data/import-data-success').then((c) => c.ImportDataSuccessComponent),
  },
];
