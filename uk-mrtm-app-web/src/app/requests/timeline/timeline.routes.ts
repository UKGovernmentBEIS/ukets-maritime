import { inject } from '@angular/core';
import { Routes } from '@angular/router';

import {
  getRequestActionPageCanActivateGuard,
  getRequestActionPageCanDeactivateGuard,
  REQUEST_ACTION_PAGE_CONTENT,
} from '@netz/common/request-action';
import { RequestActionStore } from '@netz/common/store';

import { actionProviders } from '@requests/common/action.providers';
import { AER_REVIEW_SKIPPED_ROUTE_PREFIX } from '@requests/timeline/aer-review-skipped/aer-review-skipped.routes';
import { AER_REVIEWED_ROUTE_PREFIX } from '@requests/timeline/aer-reviewed';
import { AER_SUBMITTED_ROUTE_PREFIX } from '@requests/timeline/aer-submitted/aer-submitted.routes';
import { AER_VERIFICATION_SUBMITTED_ROUTE_PREFIX } from '@requests/timeline/aer-verification-submitted/aer-verification-submitted.routes';
import { timelineContent } from '@requests/timeline/timeline.content';
import { VIR_REVIEWED_ROUTE_PREFIX } from '@requests/timeline/vir-reviewed';
import { VIR_SUBMITTED_ROUTE_PREFIX } from '@requests/timeline/vir-submitted';
import { taskActionTypeToTitleMap } from '@shared/constants';
import { resetPersistableStateGuard } from '@shared/guards';

export const TIMELINE_ROUTES: Routes = [
  {
    path: ':actionId',
    providers: actionProviders,
    canActivate: [getRequestActionPageCanActivateGuard(), resetPersistableStateGuard],
    canDeactivate: [getRequestActionPageCanDeactivateGuard()],
    children: [
      {
        path: '',
        providers: [{ provide: REQUEST_ACTION_PAGE_CONTENT, useValue: timelineContent }],
        data: { breadcrumb: ({ taskType }) => taskActionTypeToTitleMap?.[taskType] },
        title: () => taskActionTypeToTitleMap?.[inject(RequestActionStore).state.action.type],
        resolve: { taskType: () => inject(RequestActionStore).state.action.type },
        loadChildren: () => import('@netz/common/request-action').then((r) => r.REQUEST_ACTION_ROUTES),
      },
      {
        path: 'emp-submitted',
        loadChildren: () =>
          import('@requests/timeline/emp-submitted/emp-submitted.routes').then((r) => r.EMP_SUBMITTED_ROUTES),
      },
      {
        path: 'emp-reviewed',
        loadChildren: () => import('@requests/timeline/emp-reviewed').then((r) => r.EMP_REVIEWED_ROUTES),
      },
      {
        path: 'emp-variation-submitted',
        loadChildren: () =>
          import('@requests/timeline/emp-variation-submitted/emp-variation-submitted.routes').then(
            (r) => r.EMP_VARIATION_SUBMITTED_ROUTES,
          ),
      },
      {
        path: 'emp-variation-reviewed',
        loadChildren: () =>
          import('@requests/timeline/emp-variation-reviewed').then((r) => r.EMP_VARIATION_REVIEWED_ROUTES),
      },
      {
        path: 'emp-variation-reg-reviewed',
        loadChildren: () =>
          import('@requests/timeline/emp-variation-regulator-approved').then((r) => r.EMP_VARIATION_REGULATOR_APPROVED),
      },
      {
        path: 'file-download',
        loadChildren: () =>
          import('@shared/components/file-download/file-download.routes').then((r) => r.FILE_DOWNLOAD_ROUTES),
      },
      {
        path: AER_SUBMITTED_ROUTE_PREFIX,
        loadChildren: () =>
          import('@requests/timeline/aer-submitted/aer-submitted.routes').then((r) => r.AER_SUBMITTED_ROUTES),
      },
      {
        path: AER_VERIFICATION_SUBMITTED_ROUTE_PREFIX,
        loadChildren: () =>
          import('@requests/timeline/aer-verification-submitted/aer-verification-submitted.routes').then(
            (r) => r.AER_VERIFICATION_SUBMITTED_ROUTES,
          ),
      },
      {
        path: AER_REVIEW_SKIPPED_ROUTE_PREFIX,
        loadChildren: () =>
          import('@requests/timeline/aer-review-skipped/aer-review-skipped.routes').then(
            (r) => r.AER_REVIEW_SKIPPED_ROUTES,
          ),
      },
      {
        path: VIR_SUBMITTED_ROUTE_PREFIX,
        loadChildren: () => import('@requests/timeline/vir-submitted').then((r) => r.VIR_SUBMITTED_ROUTES),
      },
      {
        path: AER_REVIEWED_ROUTE_PREFIX,
        loadChildren: () => import('@requests/timeline/aer-reviewed').then((r) => r.AER_REVIEWED_ROUTES),
      },
      {
        path: VIR_REVIEWED_ROUTE_PREFIX,
        loadChildren: () => import('@requests/timeline/vir-reviewed').then((r) => r.VIR_REVIEWED_ROUTES),
      },
    ],
  },
];
