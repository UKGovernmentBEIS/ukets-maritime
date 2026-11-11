import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { DeleteGuard } from '@service-access/external-contacts/delete/delete.guard';
import { DetailsGuard } from '@service-access/external-contacts/details/details.guard';

export const EXTERNAL_CONTACTS_ROUTES: Routes = [
  {
    path: 'add',
    title: 'Add an external contact',
    data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'external-contacts' },
    canDeactivate: [PendingRequestGuard],
    loadComponent: () =>
      import('@service-access/external-contacts/details/details.component').then((c) => c.DetailsComponent),
  },
  {
    path: ':userId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'External contact details',
        canActivate: [DetailsGuard],
        resolve: { contact: DetailsGuard },
        canDeactivate: [PendingRequestGuard],
        data: { breadcrumb: false, backlink: '../../', backlinkFragment: 'external-contacts' },
        loadComponent: () =>
          import('@service-access/external-contacts/details/details.component').then((c) => c.DetailsComponent),
      },
      {
        path: 'delete',
        pathMatch: 'full',
        title: 'Confirm that this external contact will be deleted',
        data: { breadcrumb: false },
        canActivate: [DeleteGuard],
        resolve: { contact: DeleteGuard },
        canDeactivate: [PendingRequestGuard],
        loadComponent: () =>
          import('@service-access/external-contacts/delete/delete.component').then((c) => c.DeleteComponent),
      },
    ],
  },
];
