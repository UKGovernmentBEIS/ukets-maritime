import { Routes } from '@angular/router';

import { CreateVerificationBodyComponent } from '@verification-bodies/create-verification-body/create-verification-body.component';
import { canActivateSuccessGuard, SuccessComponent } from '@verification-bodies/create-verification-body/success';
import { canActivateSummaryGuard, SummaryComponent } from '@verification-bodies/create-verification-body/summary';

export const CREATE_VERIFICATION_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: false, backlink: '../' },
    component: CreateVerificationBodyComponent,
  },
  {
    path: 'summary',
    data: { breadcrumb: false, backlink: '../' },
    component: SummaryComponent,
    canActivate: [canActivateSummaryGuard],
  },
  {
    path: 'success',
    component: SuccessComponent,
    canActivate: [canActivateSuccessGuard],
  },
];
