import { Routes } from '@angular/router';

import { canActivateImportData, IMPORT_DATA_ROUTE_PREFIX } from '@api-data-management/import-data';

export const API_DATA_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: true },
    loadComponent: () =>
      import('@api-data-management/api-data-management-container').then((c) => c.ApiDataManagementContainerComponent),
  },
  {
    path: 'file-download',
    loadChildren: () =>
      import('@shared/components/file-download/file-download.routes').then((r) => r.FILE_DOWNLOAD_ROUTES),
  },
  {
    path: IMPORT_DATA_ROUTE_PREFIX,
    title: 'Import data',
    canActivate: [canActivateImportData],
    loadChildren: () => import('@api-data-management/import-data').then((r) => r.IMPORT_DATA_ROUTES),
  },
];
