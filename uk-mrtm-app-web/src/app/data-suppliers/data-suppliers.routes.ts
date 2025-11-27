import { Routes } from '@angular/router';

import { canActivateDataSupplierForm, canActivateDataSupplierSummary } from '@data-suppliers/data-suppliers.guards';

export const DATA_SUPPLIERS_ROUTES: Routes = [
  {
    path: '',
    title: 'Manage data suppliers',
    data: { breadcrumb: true },
    loadComponent: () => import('@data-suppliers/data-suppliers-list').then((c) => c.DataSuppliersListComponent),
  },
  {
    path: 'add',
    title: 'Add a new data supplier',
    canActivate: [canActivateDataSupplierForm],
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () => import('@data-suppliers/data-suppliers-form').then((c) => c.DataSuppliersFormComponent),
      },
      {
        path: 'summary',
        data: { breadcrumb: false, backlink: '../' },
        canActivate: [canActivateDataSupplierSummary],
        loadComponent: () =>
          import('@data-suppliers/data-suppliers-form-summary').then((c) => c.DataSuppliersFormSummaryComponent),
      },
      {
        path: 'success',
        data: { breadcrumb: true },
        canActivate: [canActivateDataSupplierSummary],
        loadComponent: () =>
          import('@data-suppliers/data-suppliers-form-success').then((c) => c.DataSuppliersFormSuccessComponent),
      },
    ],
  },
];
