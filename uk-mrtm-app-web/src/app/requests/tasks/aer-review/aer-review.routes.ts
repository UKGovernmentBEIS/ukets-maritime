import { Routes } from '@angular/router';

import { PayloadMutatorsHandler, SideEffectsHandler } from '@netz/common/forms';

import {
  AER_REVIEW_AVAILABLE_OPTIONS,
  AER_REVIEW_DATA_TYPE,
  AER_REVIEW_NO_OBLIGATION_ROUTE_PREFIX,
  AER_REVIEW_OPERATOR_SIDE_ROUTE_PREFIX,
  AER_REVIEW_VERIFIER_SIDE_ROUTE_PREFIX,
} from '@requests/tasks/aer-review/aer-review.constants';
import {
  canActivateAerReviewOperatorsOrVerifiersSubtasks,
  canActivateAerReviewReportingObligation,
  canActivateAerReviewSubtasks,
} from '@requests/tasks/aer-review/aer-review.guard';
import {
  provideAerReviewFlowManagers,
  provideAerReviewPayloadMutators,
  provideAerReviewSideEffects,
  provideAerReviewTaskServices,
} from '@requests/tasks/aer-review/aer-review.providers';
import {
  canActivateCompleteReview,
  COMPLETE_REVIEW_ROUTE_PREFIX,
} from '@requests/tasks/aer-review/subtasks/complete-review';
import { canActivateSkipReview, SKIP_REVIEW_ROUTE_PREFIX } from '@requests/tasks/aer-review/subtasks/skip-review';

export const AER_REVIEW_ROUTES: Routes = [
  {
    path: '',
    canActivate: [canActivateAerReviewSubtasks],
    providers: [
      PayloadMutatorsHandler,
      SideEffectsHandler,
      provideAerReviewTaskServices(),
      provideAerReviewPayloadMutators(),
      provideAerReviewSideEffects(),
      provideAerReviewFlowManagers(),
    ],
    children: [
      {
        path: AER_REVIEW_OPERATOR_SIDE_ROUTE_PREFIX,
        canActivate: [canActivateAerReviewOperatorsOrVerifiersSubtasks],
        providers: [
          { provide: AER_REVIEW_AVAILABLE_OPTIONS, useValue: ['ACCEPTED', 'OPERATOR_AMENDS_NEEDED'] },
          { provide: AER_REVIEW_DATA_TYPE, useValue: 'AER_DATA' },
        ],
        loadChildren: () =>
          import('@requests/tasks/aer-review/subtasks/operator-side').then((r) => r.OPERATOR_SUBTASK_ROUTES),
      },
      {
        path: AER_REVIEW_VERIFIER_SIDE_ROUTE_PREFIX,
        canActivate: [canActivateAerReviewOperatorsOrVerifiersSubtasks],
        providers: [
          { provide: AER_REVIEW_AVAILABLE_OPTIONS, useValue: ['ACCEPTED'] },
          { provide: AER_REVIEW_DATA_TYPE, useValue: 'VERIFICATION_REPORT_DATA' },
        ],
        loadChildren: () =>
          import('@requests/tasks/aer-review/subtasks/verifier-side').then((r) => r.VERIFIER_SUBTASK_ROUTES),
      },
      {
        path: AER_REVIEW_NO_OBLIGATION_ROUTE_PREFIX,
        canActivate: [canActivateAerReviewReportingObligation],
        providers: [
          { provide: AER_REVIEW_AVAILABLE_OPTIONS, useValue: ['ACCEPTED', 'OPERATOR_AMENDS_NEEDED'] },
          { provide: AER_REVIEW_DATA_TYPE, useValue: 'AER_DATA' },
        ],
        loadChildren: () =>
          import('@requests/tasks/aer-review/subtasks/reporting-obligation').then(
            (r) => r.REPORTING_OBLIGATION_SUBTASK_ROUTES,
          ),
      },
      {
        path: SKIP_REVIEW_ROUTE_PREFIX,
        canActivate: [canActivateSkipReview],
        loadChildren: () => import('@requests/tasks/aer-review/subtasks/skip-review').then((r) => r.SKIP_REVIEW_ROUTES),
      },
      {
        path: COMPLETE_REVIEW_ROUTE_PREFIX,
        canActivate: [canActivateCompleteReview],
        loadChildren: () =>
          import('@requests/tasks/aer-review/subtasks/complete-review').then((r) => r.SUBMIT_REVIEW_ROUTES),
      },
      {
        path: 'return-for-changes',
        title: 'Return for changes',
        loadChildren: () =>
          import('@requests/tasks/aer-review/subtasks/return-for-changes').then((c) => c.RETURN_FOR_CHANGES_ROUTES),
      },
    ],
  },
];
