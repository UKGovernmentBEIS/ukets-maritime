import { Routes } from '@angular/router';

import { canActivateAppointDataSupplier } from '@verifiers/components/data-supplier/data-supplier.guard';

export const DATA_SUPPLIER_ROUTES: Routes = [
  {
    path: 'appoint',
    canActivate: [canActivateAppointDataSupplier],
    title: 'Appoint a data supplier',
    loadComponent: () =>
      import('@verifiers/components/data-supplier/data-supplier-appoint').then((c) => c.DataSupplierAppointComponent),
  },
  {
    path: 'replace',
    title: 'Replace a data supplier',
    loadComponent: () =>
      import('@verifiers/components/data-supplier/data-supplier-appoint').then((c) => c.DataSupplierAppointComponent),
  },
  {
    path: 'appoint-success',
    title: 'You have successfully appointed a data supplier',
    loadComponent: () =>
      import('@verifiers/components/data-supplier/data-supplier-appoint-success').then(
        (c) => c.DataSupplierAppointSuccessComponent,
      ),
  },
  {
    path: 'unappoint-success',
    title: 'You have no data supplier appointed',
    loadComponent: () =>
      import('@verifiers/components/data-supplier/data-supplier-unappoint-success').then(
        (c) => c.DataSupplierUnappointSuccessComponent,
      ),
  },
];
