import { Routes } from '@angular/router';

import { canActivateReturnForAmends } from '@requests/tasks/notification-follow-up-review/follow-up-review.guard';

export const RETURN_FOR_AMENDS_ROUTES: Routes = [
  {
    path: '',
    title: 'Return for amends',
    canActivate: [canActivateReturnForAmends],
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/tasks/notification-follow-up-review/return-for-amends/return-for-amends-confirm').then(
        (c) => c.ReturnForAmendsConfirmComponent,
      ),
  },
  {
    path: 'success',
    title: 'Returned to operator for amends',
    loadComponent: () =>
      import('@requests/tasks/notification-follow-up-review/return-for-amends/return-for-amends-success').then(
        (c) => c.ReturnForAmendsSuccessComponent,
      ),
  },
];
