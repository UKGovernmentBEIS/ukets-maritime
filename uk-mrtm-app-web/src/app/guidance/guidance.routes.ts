import { Routes } from '@angular/router';

import { GuidanceStore } from '@guidance/+state';
import { canActivateGuidance, canActivateManageGuidance } from '@guidance/guidance.guards';
import { MANAGE_DOCUMENTS_ROUTE_PREFIX } from '@guidance/manage-documents';
import { MANAGE_SECTIONS_ROUTE_PREFIX } from '@guidance/manage-sections';
import { GuidanceService } from '@guidance/services';

export const GUIDANCE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [canActivateGuidance],
    providers: [GuidanceService, GuidanceStore],
    children: [
      {
        path: '',
        title: 'Guidance',
        loadComponent: () => import('@guidance/guidance-list').then((c) => c.GuidanceListComponent),
      },
      {
        path: 'manage',
        canActivate: [canActivateManageGuidance],
        children: [
          {
            path: MANAGE_SECTIONS_ROUTE_PREFIX,
            loadChildren: () =>
              import('@guidance/manage-sections/manage-sections.routes').then((r) => r.MANAGE_SECTIONS_ROUTES),
          },
          {
            path: MANAGE_DOCUMENTS_ROUTE_PREFIX,
            loadChildren: () =>
              import('@guidance/manage-documents/manage-documents.routes').then((r) => r.MANAGE_DOCUMENTS_ROUTES),
          },
        ],
      },
      {
        path: ':guidanceSectionId/download',
        loadChildren: () =>
          import('@shared/components/file-download/file-download.routes').then((c) => c.FILE_DOWNLOAD_ROUTES),
      },
    ],
  },
];
