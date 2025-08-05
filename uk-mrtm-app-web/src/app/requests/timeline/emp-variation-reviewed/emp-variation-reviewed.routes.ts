import { Routes } from '@angular/router';

import { REQUEST_ACTION_PAGE_CONTENT } from '@netz/common/request-action';

import { getEmpTaskSectionsContent } from '@requests/common';

export const EMP_VARIATION_REVIEWED_ROUTES: Routes = [
  {
    path: '',
    providers: [
      {
        provide: REQUEST_ACTION_PAGE_CONTENT,
        useValue: {
          EMP_VARIATION_APPLICATION_APPROVED: getEmpTaskSectionsContent('details', true),
          EMP_VARIATION_APPLICATION_REJECTED: getEmpTaskSectionsContent('details', true),
          EMP_VARIATION_APPLICATION_DEEMED_WITHDRAWN: getEmpTaskSectionsContent('details', true),
        },
      },
    ],
    loadComponent: () => import('@netz/common/request-action').then((c) => c.RequestActionPageComponent),
  },
  {
    path: 'details',
    loadChildren: () =>
      import('@requests/timeline/emp-variation-submitted/emp-variation-submitted.routes').then(
        (r) => r.EMP_VARIATION_SUBMITTED_ROUTES,
      ),
  },
];
