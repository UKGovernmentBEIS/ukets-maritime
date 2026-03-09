import { Routes } from '@angular/router';

export const DATA_SUPPLIER_ROUTES: Routes = [
  {
    path: 'appoint',
    loadComponent: () =>
      import('@accounts/containers/data-supplier/data-supplier-appoint').then((c) => c.DataSupplierAppointComponent),
  },
  {
    path: 'replace',
    loadComponent: () =>
      import('@accounts/containers/data-supplier/data-supplier-appoint').then((c) => c.DataSupplierAppointComponent),
  },
  {
    path: 'appoint-success',
    loadComponent: () =>
      import('@accounts/containers/data-supplier/data-supplier-appoint-success').then(
        (c) => c.DataSupplierAppointSuccessComponent,
      ),
  },
  {
    path: 'unappoint-success',
    loadComponent: () =>
      import('@accounts/containers/data-supplier/data-supplier-unappoint-success').then(
        (c) => c.DataSupplierUnappointSuccessComponent,
      ),
  },
];
