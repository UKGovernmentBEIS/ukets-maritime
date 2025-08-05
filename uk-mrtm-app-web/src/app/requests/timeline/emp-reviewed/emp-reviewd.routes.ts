import { Routes } from '@angular/router';

import { REQUEST_ACTION_PAGE_CONTENT } from '@netz/common/request-action';

import { getEmpTaskSectionsContent } from '@requests/common';

export const EMP_REVIEWED_ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: REQUEST_ACTION_PAGE_CONTENT,
        useValue: {
          EMP_ISSUANCE_APPLICATION_APPROVED: getEmpTaskSectionsContent('details'),
          EMP_ISSUANCE_APPLICATION_DEEMED_WITHDRAWN: getEmpTaskSectionsContent('details'),
        },
      },
    ],
    loadComponent: () => import('@netz/common/request-action').then((c) => c.RequestActionPageComponent),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('@requests/timeline/emp-submitted/emp-submitted.routes').then((r) => r.EMP_SUBMITTED_ROUTES),
  },
];
