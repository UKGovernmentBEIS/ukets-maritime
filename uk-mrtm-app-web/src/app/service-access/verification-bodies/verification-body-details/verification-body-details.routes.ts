import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { PendingRequestGuard } from '@core/guards';
import { VerifierUserStore } from '@service-access/verifiers/+state/verifier-user.store';
import { verifierUserAddGuard } from '@service-access/verifiers/verifier-user-add';
import { verifierUserAddSuccessGuard } from '@service-access/verifiers/verifier-user-add-success';
import { verifierUserAddSummaryGuard } from '@service-access/verifiers/verifier-user-add-summary';
import { verifierUserDetailsGuard } from '@service-access/verifiers/verifier-user-details';

export const VERIFICATION_BODY_DETAILS_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('@service-access/verification-bodies/verification-body-details/verification-body-details.component').then(
        (c) => c.VerificationBodyDetailsComponent,
      ),
  },
  {
    path: 'edit',
    canDeactivate: [PendingRequestGuard],
    data: { breadcrumb: false, backlink: '../', backlinkFragment: 'details' },
    title: 'Verification body details - Edit verification body details',
    loadComponent: () =>
      import('@service-access/verification-bodies/verification-body-details/edit').then((c) => c.EditComponent),
  },
  {
    path: 'delete',
    title: 'Verification body details - Delete verification body',
    children: [
      {
        path: '',
        data: { breadcrumb: false },
        canDeactivate: [PendingRequestGuard],
        loadComponent: () =>
          import('@service-access/verification-bodies/verification-body-details/delete').then((c) => c.DeleteComponent),
      },
      {
        path: 'success',
        title: 'Verification body details - Delete success',
        data: { breadcrumb: false },
        loadComponent: () =>
          import('@service-access/verification-bodies/verification-body-details/delete').then(
            (c) => c.SuccessComponent,
          ),
      },
    ],
  },
  {
    path: 'verifiers',
    children: [
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
            data: { breadcrumb: false, backlink: '../' },
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
                  import('@service-access/verification-bodies/verification-body-details/delete').then(
                    (c) => c.DeleteComponent,
                  ),
              },
              {
                path: 'success',
                data: { breadcrumb: false },
                loadComponent: () =>
                  import('@service-access/verification-bodies/verification-body-details/delete').then(
                    (c) => c.SuccessComponent,
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
            data: { breadcrumb: false, backlink: '../../../', backlinkFragment: 'contacts' },
            loadComponent: () =>
              import('@service-access/verifiers/verifier-user-add').then((c) => c.VerifierUserAddComponent),
          },
          {
            path: 'summary',
            canActivate: [verifierUserAddSummaryGuard],
            canDeactivate: [PendingRequestGuard],
            loadComponent: () =>
              import('@service-access/verifiers/verifier-user-add-summary').then(
                (c) => c.VerifierUserAddSummaryComponent,
              ),
          },
          {
            path: 'success',
            data: { breadcrumb: false },
            canActivate: [verifierUserAddSuccessGuard],
            loadComponent: () =>
              import('@service-access/verifiers/verifier-user-add-success').then(
                (c) => c.VerifierUserAddSuccessComponent,
              ),
          },
        ],
      },
    ],
  },
];
