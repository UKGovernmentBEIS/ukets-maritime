import { Routes } from '@angular/router';

import {
  canActivateAppointDataSupplier,
  canActivateDataSupplierForm,
  canActivateDataSupplierSummary,
} from '@service-access/data-suppliers/data-suppliers.guards';
import { roleCanMatch } from '@service-access/service-access.guards';

export const DATA_SUPPLIERS_ROUTES: Routes = [
  // Regulator flows: managing the data supplier profiles
  {
    path: 'add',
    canMatch: [roleCanMatch('REGULATOR')],
    canActivate: [canActivateDataSupplierForm],
    children: [
      {
        path: '',
        title: 'Add a new data supplier',
        data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'data-suppliers' },
        loadComponent: () =>
          import('@service-access/data-suppliers/data-suppliers-form').then((c) => c.DataSuppliersFormComponent),
      },
      {
        path: 'summary',
        title: 'Data supplier summary',
        data: { breadcrumb: false, backlink: '../' },
        canActivate: [canActivateDataSupplierSummary],
        loadComponent: () =>
          import('@service-access/data-suppliers/data-suppliers-form-summary').then(
            (c) => c.DataSuppliersFormSummaryComponent,
          ),
      },
      {
        path: 'success',
        title: 'Data supplier successfully added',
        data: { breadcrumb: false },
        canActivate: [canActivateDataSupplierSummary],
        loadComponent: () =>
          import('@service-access/data-suppliers/data-suppliers-form-success').then(
            (c) => c.DataSuppliersFormSuccessComponent,
          ),
      },
    ],
  },
  // Verifier flows: appointing a data supplier to the verification body
  {
    path: 'appoint',
    canMatch: [roleCanMatch('VERIFIER')],
    data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'data-suppliers' },
    canActivate: [canActivateAppointDataSupplier],
    title: 'Appoint a data supplier',
    loadComponent: () =>
      import('@service-access/data-suppliers/data-supplier-appoint').then((c) => c.DataSupplierAppointComponent),
  },
  {
    path: 'replace',
    canMatch: [roleCanMatch('VERIFIER')],
    title: 'Replace a data supplier',
    loadComponent: () =>
      import('@service-access/data-suppliers/data-supplier-appoint').then((c) => c.DataSupplierAppointComponent),
  },
  {
    path: 'appoint-success',
    canMatch: [roleCanMatch('VERIFIER')],
    data: { breadcrumb: false },
    title: 'You have successfully appointed a data supplier',
    loadComponent: () =>
      import('@service-access/data-suppliers/data-supplier-appoint-success').then(
        (c) => c.DataSupplierAppointSuccessComponent,
      ),
  },
  {
    path: 'unappoint-success',
    canMatch: [roleCanMatch('VERIFIER')],
    data: { breadcrumb: false },
    title: 'You have no data supplier appointed',
    loadComponent: () =>
      import('@service-access/data-suppliers/data-supplier-unappoint-success').then(
        (c) => c.DataSupplierUnappointSuccessComponent,
      ),
  },
];
