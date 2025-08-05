import { Routes } from '@angular/router';

import { aerTotalEmissionsMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';

export const AER_TOTAL_EMISSIONS_ROUTES: Routes = [
  {
    path: '',
    title: aerTotalEmissionsMap.title,
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@requests/common/aer/subtasks/aer-total-emissions/aer-total-emissions-summary').then(
        (c) => c.AerTotalEmissionsSummaryComponent,
      ),
  },
];
