import { Routes } from '@angular/router';

import { MANAGE_DOCUMENTS_ROUTE_PARAM } from '@guidance/manage-documents/manage-documents.constants';
import {
  canActivateManageDocumentForm,
  canActivateManageDocumentsSummary,
} from '@guidance/manage-documents/manage-documents.guard';

export const MANAGE_DOCUMENTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Manage documents',
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@guidance/manage-documents/manage-documents-type-form').then((c) => c.ManageDocumentsTypeFormComponent),
  },
  {
    path: 'create',
    children: [
      {
        path: '',
        title: 'Add file details',
        data: { breadcrumb: false, backlink: '../' },
        canActivate: [canActivateManageDocumentForm()],
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-form').then((c) => c.ManageDocumentsFormComponent),
      },
      {
        path: 'summary',
        title: 'Check your answers',
        canActivate: [canActivateManageDocumentsSummary()],
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-summary').then((c) => c.ManageDocumentsSummaryComponent),
      },
      {
        path: 'success',
        title: 'The file has been added',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-success').then((c) => c.ManageDocumentsSuccessComponent),
      },
    ],
  },
  {
    path: `update`,
    children: [
      {
        path: `:${MANAGE_DOCUMENTS_ROUTE_PARAM}`,
        title: 'Edit section',
        data: { breadcrumb: false, backlink: '../../' },
        canActivate: [canActivateManageDocumentForm('../../')],
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-form').then((c) => c.ManageDocumentsFormComponent),
      },
      {
        path: `:${MANAGE_DOCUMENTS_ROUTE_PARAM}/summary`,
        title: 'Check your answers',
        canActivate: [canActivateManageDocumentsSummary()],
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-summary').then((c) => c.ManageDocumentsSummaryComponent),
      },
      {
        path: `:${MANAGE_DOCUMENTS_ROUTE_PARAM}/success`,
        title: 'The section has been updated',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-success').then((c) => c.ManageDocumentsSuccessComponent),
      },
    ],
  },
  {
    path: `delete/:${MANAGE_DOCUMENTS_ROUTE_PARAM}`,
    children: [
      {
        path: '',
        title: 'Check your answers',
        canActivate: [canActivateManageDocumentForm('../../')],
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-summary').then((c) => c.ManageDocumentsSummaryComponent),
      },
      {
        path: 'success',
        title: 'The section has been added',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@guidance/manage-documents/manage-documents-success').then((c) => c.ManageDocumentsSuccessComponent),
      },
    ],
  },
];
