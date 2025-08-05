import { Route } from '@angular/router';

import { getRequestTaskPageDefaultCanActivateGuard } from '@netz/common/request-task';

import {
  canActivateRegistry,
  canDeactivateRegistry,
} from '@requests/common/emp/registry-integration/registry-integration.guard';

export const REGISTRY_INTEGRATION_ROUTES: Route[] = [
  {
    path: 'submit',
    canActivate: [canActivateRegistry],
    canDeactivate: [canDeactivateRegistry],
    children: [
      {
        path: '',
        title: 'Send information to the registry',
        data: {
          backlink: `../../`,
          breadcrumb: false,
        },
        loadComponent: () =>
          import('@requests/common/emp/registry-integration/registry-integration-submit').then(
            (c) => c.RegistryIntegrationSubmitComponent,
          ),
      },
      {
        path: 'success',
        title: 'Integration with Registry Success',
        data: {
          breadcrumb: false,
        },
        // canActivate guard forces reload of requestTaskItem and timeline items
        canActivate: [getRequestTaskPageDefaultCanActivateGuard()],
        loadComponent: () =>
          import('@requests/common/emp/registry-integration/registry-integration-success').then(
            (c) => c.RegistryIntegrationSuccessComponent,
          ),
      },
    ],
  },
];
