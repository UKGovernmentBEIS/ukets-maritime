import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards';
import { VerifierUserStore } from '@verifiers/+state/verifier-user.store';
import {
  AddComponent,
  addGuard,
  AddSuccessComponent,
  addSuccessGuard,
  AddSummaryComponent,
  addSummaryGuard,
} from '@verifiers/add';
import { DATA_SUPPLIER_ROUTE_PREFIX } from '@verifiers/components';
import { DeleteComponent } from '@verifiers/delete/delete.component';
import { SuccessComponent } from '@verifiers/delete/success/success.component';
import { DetailsComponent, detailsGuard, EditComponent } from '@verifiers/details';
import { VerifiersComponent } from '@verifiers/verifiers.component';
import { verifiersGuard } from '@verifiers/verifiers.guard';

export const VERIFIERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [verifiersGuard],
    component: VerifiersComponent,
  },
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
        component: DetailsComponent,
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
        data: { breadcrumb: false, backlink: '../../' },
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
  {
    path: DATA_SUPPLIER_ROUTE_PREFIX,
    loadChildren: () => import('@verifiers/components/data-supplier').then((m) => m.DATA_SUPPLIER_ROUTES),
  },
];
