import { Routes } from '@angular/router';

export const FILE_DOWNLOAD_ROUTES: Routes = [
  {
    path: ':uuid',
    loadComponent: () =>
      import('@shared/components/file-download/file-download.component').then((c) => c.FileDownloadComponent),
  },
  {
    path: ':fileType/:uuid',
    loadComponent: () =>
      import('@shared/components/file-download/file-download.component').then((c) => c.FileDownloadComponent),
  },
];
