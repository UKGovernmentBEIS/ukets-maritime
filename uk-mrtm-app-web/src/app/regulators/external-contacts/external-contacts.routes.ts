import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { DeleteComponent } from '@regulators/external-contacts/delete/delete.component';
import { DeleteGuard } from '@regulators/external-contacts/delete/delete.guard';
import { DetailsComponent } from '@regulators/external-contacts/details/details.component';
import { DetailsGuard } from '@regulators/external-contacts/details/details.guard';

export const EXTERNAL_CONTACTS_ROUTES: Routes = [
  {
    path: 'add',
    title: 'Add an external contact',
    data: { breadcrumb: true },
    component: DetailsComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: ':userId',
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'External contact details',
        data: { breadcrumb: true },
        component: DetailsComponent,
        canActivate: [DetailsGuard],
        resolve: { contact: DetailsGuard },
        canDeactivate: [PendingRequestGuard],
      },
      {
        path: 'delete',
        pathMatch: 'full',
        title: 'Confirm that this external contact will be deleted',
        data: { breadcrumb: 'Delete external contact' },
        component: DeleteComponent,
        canActivate: [DeleteGuard],
        resolve: { contact: DeleteGuard },
        canDeactivate: [PendingRequestGuard],
      },
    ],
  },
];
