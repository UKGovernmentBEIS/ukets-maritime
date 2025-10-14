import { Routes } from '@angular/router';

import { MANAGE_SECTION_ROUTE_PARAM } from '@guidance/manage-sections/manage-sections.constants';
import {
  canActivateManageSectionForm,
  canActivateManageSectionSummary,
} from '@guidance/manage-sections/manage-sections.guard';

export const MANAGE_SECTIONS_ROUTES: Routes = [
  {
    path: '',
    title: 'Manage sections',
    data: { breadcrumb: false, backlink: '../../' },
    loadComponent: () =>
      import('@guidance/manage-sections/manage-sections-type-form').then((c) => c.ManageSectionsTypeFormComponent),
  },
  {
    path: 'create',
    children: [
      {
        path: '',
        title: 'Create new section',
        data: { breadcrumb: false, backlink: '../' },
        canActivate: [canActivateManageSectionForm()],
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-form').then((c) => c.ManageSectionsFormComponent),
      },
      {
        path: 'summary',
        title: 'Check your answers',
        canActivate: [canActivateManageSectionSummary()],
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-summary').then((c) => c.ManageSectionsSummaryComponent),
      },
      {
        path: 'success',
        title: 'The section has been added',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-success').then((c) => c.ManageSectionsSuccessComponent),
      },
    ],
  },
  {
    path: `update`,
    children: [
      {
        path: `:${MANAGE_SECTION_ROUTE_PARAM}`,
        title: 'Edit section',
        data: { breadcrumb: false, backlink: '../../' },
        canActivate: [canActivateManageSectionForm('../../')],
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-form').then((c) => c.ManageSectionsFormComponent),
      },
      {
        path: `:${MANAGE_SECTION_ROUTE_PARAM}/summary`,
        title: 'Check your answers',
        canActivate: [canActivateManageSectionSummary()],
        data: { breadcrumb: false, backlink: '../' },
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-summary').then((c) => c.ManageSectionsSummaryComponent),
      },
      {
        path: `:${MANAGE_SECTION_ROUTE_PARAM}/success`,
        title: 'The section has been updated',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-success').then((c) => c.ManageSectionsSuccessComponent),
      },
    ],
  },
  {
    path: `delete/:${MANAGE_SECTION_ROUTE_PARAM}`,
    children: [
      {
        path: '',
        title: 'Check your answers',
        canActivate: [canActivateManageSectionForm('../../')],
        data: { breadcrumb: false, backlink: '../../' },
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-summary').then((c) => c.ManageSectionsSummaryComponent),
      },
      {
        path: 'success',
        title: 'The section has been added',
        data: { breadcrumb: 'Dashboard' },
        loadComponent: () =>
          import('@guidance/manage-sections/manage-sections-success').then((c) => c.ManageSectionsSuccessComponent),
      },
    ],
  },
];
