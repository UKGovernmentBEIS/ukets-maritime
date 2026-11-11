import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { VerificationBodiesStoreService } from '@service-access/verification-bodies/+state/verification-bodies-store.service';
import { canDeactivateCreateVerificationBodyGuard } from '@service-access/verification-bodies/create-verification-body';
import { verificationBodyDetailsGuard } from '@service-access/verification-bodies/verification-body-details';

export const VERIFICATION_BODIES_ROUTES: Routes = [
  {
    path: 'add',
    title: 'Verification body details - Add a verification body',
    canDeactivate: [canDeactivateCreateVerificationBodyGuard],
    loadChildren: () =>
      import('@service-access/verification-bodies/create-verification-body/create-verification-body.routes').then(
        (m) => m.CREATE_VERIFICATION_ROUTES,
      ),
  },
  {
    path: ':id',
    canActivate: [verificationBodyDetailsGuard],
    title: 'Verification body details',
    data: {
      // Every page under a verification body that shows breadcrumbs belongs to its verifiers,
      // so the body's own crumb lands on its Contacts tab
      breadcrumb: {
        resolveText: ({ verificationBodyName }) => verificationBodyName ?? 'Verification body details',
        skipLink: false,
        fragment: 'contacts',
      },
    },
    resolve: {
      verificationBodyName: () =>
        inject(VerificationBodiesStoreService).getState().currentVerificationBody?.verificationBody?.name,
    },
    loadChildren: () =>
      import('@service-access/verification-bodies/verification-body-details/verification-body-details.routes').then(
        (m) => m.VERIFICATION_BODY_DETAILS_ROUTES,
      ),
  },
];
