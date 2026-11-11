import { Routes } from '@angular/router';

import { canActivateSuccessGuard } from '@service-access/verification-bodies/create-verification-body/success';
import { canActivateSummaryGuard } from '@service-access/verification-bodies/create-verification-body/summary';

export const CREATE_VERIFICATION_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'verification-bodies' },
    loadComponent: () =>
      import('@service-access/verification-bodies/create-verification-body/create-verification-body.component').then(
        (c) => c.CreateVerificationBodyComponent,
      ),
  },
  {
    path: 'summary',
    canActivate: [canActivateSummaryGuard],
    loadComponent: () =>
      import('@service-access/verification-bodies/create-verification-body/summary').then((c) => c.SummaryComponent),
  },
  {
    path: 'success',
    data: { breadcrumb: false },
    canActivate: [canActivateSuccessGuard],
    loadComponent: () =>
      import('@service-access/verification-bodies/create-verification-body/success').then((c) => c.SuccessComponent),
  },
];
