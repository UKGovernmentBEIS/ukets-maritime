import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import { verifierUserAddGuard } from '@service-access/verifiers/verifier-user-add';
import { verifierUserAddSuccessGuard } from '@service-access/verifiers/verifier-user-add-success';
import { verifierUserAddSummaryGuard } from '@service-access/verifiers/verifier-user-add-summary';
import { verifierUserDetailsGuard } from '@service-access/verifiers/verifier-user-details';

export const VERIFIERS_ROUTES: Routes = [
  {
    path: ':userId',
    canActivate: [verifierUserDetailsGuard],
    resolve: {
      verifierUser: () => inject(VerifierUserStore).getState().currentVerifierUser,
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('@service-access/verifiers/verifier-user-details').then((c) => c.VerifierUserDetailsComponent),
      },
      {
        path: 'edit',
        canDeactivate: [PendingRequestGuard],
        loadComponent: () =>
          import('@service-access/verifiers/verifier-user-edit').then((c) => c.VerifierUserEditComponent),
      },
      {
        path: 'delete',
        children: [
          {
            path: '',
            data: { breadcrumb: false },
            loadComponent: () =>
              import('@service-access/verifiers/verifier-user-delete').then((c) => c.VerifierUserDeleteComponent),
          },
          {
            path: 'success',
            data: { breadcrumb: false },
            loadComponent: () =>
              import('@service-access/verifiers/verifier-user-delete-success').then(
                (c) => c.VerifierUserDeleteSuccessComponent,
              ),
          },
        ],
      },
    ],
  },
  {
    path: 'add/:userType',
    canActivate: [verifierUserAddGuard],
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../../', backlinkFragment: 'verifier-users' },
        loadComponent: () =>
          import('@service-access/verifiers/verifier-user-add').then((c) => c.VerifierUserAddComponent),
      },
      {
        path: 'summary',
        canActivate: [verifierUserAddSummaryGuard],
        canDeactivate: [PendingRequestGuard],
        loadComponent: () =>
          import('@service-access/verifiers/verifier-user-add-summary').then((c) => c.VerifierUserAddSummaryComponent),
      },
      {
        path: 'success',
        data: { breadcrumb: false },
        canActivate: [verifierUserAddSuccessGuard],
        loadComponent: () =>
          import('@service-access/verifiers/verifier-user-add-success').then((c) => c.VerifierUserAddSuccessComponent),
      },
    ],
  },
];
