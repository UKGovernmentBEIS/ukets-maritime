import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { DeleteResolver } from '@service-access/regulators/delete/delete.resolver';
import { detailsResolver } from '@service-access/regulators/details/details.resolver';
import { permissionsResolver } from '@service-access/regulators/details/permissions.resolver';

export const REGULATORS_ROUTES: Routes = [
  {
    path: 'add',
    title: 'Add a new user',
    data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'regulator-users' },
    canDeactivate: [PendingRequestGuard],
    loadComponent: () => import('@service-access/regulators/details/details.component').then((c) => c.DetailsComponent),
  },
  {
    path: ':userId',
    children: [
      {
        path: '',
        title: 'User details',
        pathMatch: 'full',
        data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'regulator-users' },
        resolve: {
          user: detailsResolver,
          permissions: permissionsResolver,
        },
        canDeactivate: [PendingRequestGuard],
        loadComponent: () =>
          import('@service-access/regulators/details/details.component').then((c) => c.DetailsComponent),
      },
      {
        path: 'delete',
        title: 'Confirm that this user account will be deleted',
        data: { breadcrumb: false },
        resolve: { user: DeleteResolver },
        canDeactivate: [PendingRequestGuard],
        loadComponent: () =>
          import('@service-access/regulators/delete/delete.component').then((c) => c.DeleteComponent),
      },
      {
        path: '2fa',
        loadChildren: () => import('@two-fa/two-fa.routes').then((m) => m.TWO_FA_ROUTES),
      },
      {
        path: 'file-download/:uuid',
        title: 'Your download has started',
        loadComponent: () =>
          import('@service-access/regulators/file-download/signature-file-download.component').then(
            (c) => c.SignatureFileDownloadComponent,
          ),
      },
    ],
  },
  {
    path: 'file-download/:uuid',
    title: 'Your download has started',
    loadComponent: () =>
      import('@service-access/regulators/file-download/signature-file-download.component').then(
        (c) => c.SignatureFileDownloadComponent,
      ),
  },
];
