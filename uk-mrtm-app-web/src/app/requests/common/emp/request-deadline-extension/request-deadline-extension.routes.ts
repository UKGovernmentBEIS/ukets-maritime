import { Route } from '@angular/router';

import {
  REQUEST_NOTIFICATION_DATA,
  REQUEST_NOTIFICATION_SERVICE,
} from '@requests/common/emp/components/request-notification-form/request-notification-form.provider';
import { canActivateRfiOrRdeRequestGuard } from '@requests/common/emp/guards';
import { rdeQuery } from '@requests/common/emp/request-deadline-extension/+state';
import { RdeWizardSteps } from '@requests/common/emp/request-deadline-extension/request-deadline-extension.consts';
import {
  canActivateRdeDecisionSuccess,
  canActivateRdeNotificationForm,
  canActivateRdeSubmit,
  canActivateRdeSuccess,
  canActivateRdeSummary,
  canDeactivateRdeSubmit,
} from '@requests/common/emp/request-deadline-extension/request-deadline-extension.guard';
import { RequestDeadlineExtensionStore } from '@requests/common/emp/request-deadline-extension/services';
import { backlinkResolver } from '@requests/common/task-navigation';

export const REQUEST_DEADLINE_EXTENSION_ROUTES: Route[] = [
  {
    path: 'submit',
    canActivate: [canActivateRdeSubmit],
    canDeactivate: [canDeactivateRdeSubmit],
    children: [
      {
        path: '',
        title: 'Check your answers',
        data: {
          backlink: `./${RdeWizardSteps.RDE_DEADLINE_NOTIFICATION}`,
          breadcrumb: false,
        },
        canActivate: [canActivateRdeSummary],
        loadComponent: () =>
          import('@requests/common/emp/request-deadline-extension/request-deadline-extension-summary').then(
            (c) => c.RequestDeadlineExtensionSummaryComponent,
          ),
      },
      {
        path: RdeWizardSteps.RDE_DEADLINE_EXTENSION,
        title: 'Request deadline extension (RDE)',
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(RdeWizardSteps.SUMMARY, '../../'),
        },
        canActivate: [canActivateRfiOrRdeRequestGuard('../../not-allowed')],
        loadComponent: () =>
          import('@requests/common/emp/request-deadline-extension/request-deadline-extension-form').then(
            (c) => c.RequestDeadlineExtensionFormComponent,
          ),
      },
      {
        path: RdeWizardSteps.RDE_DEADLINE_NOTIFICATION,
        data: { breadcrumb: false },
        title: 'Select who you want to notify about this request',
        resolve: {
          backlink: backlinkResolver(RdeWizardSteps.SUMMARY, RdeWizardSteps.RDE_DEADLINE_EXTENSION),
        },
        providers: [
          { provide: REQUEST_NOTIFICATION_SERVICE, useExisting: RequestDeadlineExtensionStore },
          {
            provide: REQUEST_NOTIFICATION_DATA,
            deps: [RequestDeadlineExtensionStore],
            useFactory: (store: RequestDeadlineExtensionStore) => store.select(rdeQuery.selectRde),
          },
        ],
        canActivate: [canActivateRdeNotificationForm],
        loadComponent: () =>
          import('@requests/common/emp/components/request-notification-form').then(
            (c) => c.RequestNotificationFormComponent,
          ),
      },
      {
        path: RdeWizardSteps.SUCCESS,
        title: 'Request for deadline extension sent',
        canActivate: [canActivateRdeSuccess],
        loadComponent: () =>
          import('@requests/common/emp/request-deadline-extension/request-deadline-extension-success').then(
            (c) => c.RequestDeadlineExtensionSuccessComponent,
          ),
      },
    ],
  },
  {
    path: 'not-allowed',
    title: 'You can only have one active request at any given time',
    loadComponent: () =>
      import('@requests/common/emp/components/request-not-allowed').then((c) => c.RequestNotAllowedComponent),
  },
  {
    path: 'decision',
    children: [
      {
        path: 'success',
        title: 'Extension request decision',
        canActivate: [canActivateRdeDecisionSuccess],
        loadComponent: () =>
          import('@requests/common/emp/request-deadline-extension/request-deadline-extension-decision-success').then(
            (c) => c.RequestDeadlineExtensionDecisionSuccessComponent,
          ),
      },
    ],
  },
];
