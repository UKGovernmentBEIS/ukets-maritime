import { Routes } from '@angular/router';

export const FILE_DOWNLOAD_ROUTES: Routes = [
  {
    path: ':uuid',
    title: 'Download file',
    loadComponent: () =>
      import('@shared/components/file-download/file-download.component').then((c) => c.FileDownloadComponent),
  },
  {
    path: ':fileType/:uuid',
    title: 'Download file',
    loadComponent: () =>
      import('@shared/components/file-download/file-download.component').then((c) => c.FileDownloadComponent),
  },
];
