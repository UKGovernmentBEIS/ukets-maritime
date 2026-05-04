import { inject } from '@angular/core';
import { Route } from '@angular/router';

import { PendingRequestGuard } from '@core/guards';
import { DeleteComponent, SuccessComponent } from '@verification-bodies/verification-body-details/delete';
import { EditComponent } from '@verification-bodies/verification-body-details/edit';
import { VerificationBodyDetailsComponent } from '@verification-bodies/verification-body-details/verification-body-details.component';
import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';
import {
  AddComponent,
  addGuard,
  AddSuccessComponent,
  addSuccessGuard,
  AddSummaryComponent,
  addSummaryGuard,
} from '@verifiers/add';
import { detailsGuard } from '@verifiers/details';

export const VERIFICATION_BODY_DETAILS_ROUTES: Route[] = [
  {
    path: '',
    component: VerificationBodyDetailsComponent,
  },
  {
    path: 'edit',
    component: EditComponent,
    canDeactivate: [PendingRequestGuard],
    data: { breadcrumb: false, backlink: '../' },
    title: 'Verification body details - Edit verification body details',
  },
  {
    path: 'delete',
    title: 'Verification body details - Delete verification body',
    children: [
      {
        path: '',
        data: { breadcrumb: false, backlink: '../../' },
        component: DeleteComponent,
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'success',
        title: 'Verification body details - Delete success',
        component: SuccessComponent,
      },
    ],
  },
  {
    path: 'verifiers',
    children: [
      {
        path: ':userId',
        canActivate: [detailsGuard],
        resolve: {
          verifierUser: () => inject(VerifierUserStore).getState().currentVerifierUser,
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: (data) => `${data.verifierUser.firstName} ${data.verifierUser.lastName}`,
            },
            loadComponent: () => import('@verifiers/details').then((c) => c.DetailsComponent),
          },
          {
            path: 'edit',
            data: { breadcrumb: false, backlink: '../' },
            canDeactivate: [PendingRequestGuard],
            component: EditComponent,
          },
          {
            path: 'delete',
            data: { breadcrumb: 'Manage verifier users' },
            children: [
              {
                path: '',
                data: { breadcrumb: false, backlink: '../../' },
                component: DeleteComponent,
              },
              {
                path: 'success',
                data: { breadcrumb: 'Dashboard' },
                component: SuccessComponent,
              },
            ],
          },
        ],
      },
      {
        path: 'add/:userType',
        canActivate: [addGuard],
        children: [
          {
            path: '',
            data: { breadcrumb: false, backlink: '../../../', backlinkFragment: 'contacts' },
            component: AddComponent,
          },
          {
            path: 'summary',
            data: { breadcrumb: false, backlink: '../' },
            canActivate: [addSummaryGuard],
            canDeactivate: [PendingRequestGuard],
            component: AddSummaryComponent,
          },
          {
            path: 'success',
            canActivate: [addSuccessGuard],
            component: AddSuccessComponent,
          },
        ],
      },
    ],
  },
];
