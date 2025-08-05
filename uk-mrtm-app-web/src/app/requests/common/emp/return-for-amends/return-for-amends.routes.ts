import { Routes } from '@angular/router';

export const RETURN_FOR_AMENDS_ROUTES: Routes = [
  {
    path: '',
    title: 'Return for amends',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/emp/return-for-amends/return-for-amends-summary').then(
        (c) => c.ReturnForAmendsSummaryComponent,
      ),
  },
  {
    path: 'success',
    title: 'Returned to operator for amends',
    data: { breadcrumb: 'Dashboard' },
    loadComponent: () =>
      import('@requests/common/emp/return-for-amends/return-for-amends-success').then(
        (c) => c.ReturnForAmendsSuccessComponent,
      ),
  },
];
