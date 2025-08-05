import { Routes } from '@angular/router';

import { REQUEST_ACTION_PAGE_CONTENT } from '@netz/common/request-action';

import { getEmpTaskSectionsContent } from '@requests/common';

export const EMP_VARIATION_REGULATOR_APPROVED: Routes = [
  {
    path: '',
    providers: [
      {
        provide: REQUEST_ACTION_PAGE_CONTENT,
        useValue: {
          EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED: getEmpTaskSectionsContent('details', true),
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
