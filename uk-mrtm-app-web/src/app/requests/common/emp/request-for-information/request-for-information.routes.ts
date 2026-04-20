import { Routes } from '@angular/router';

import {
  REQUEST_NOTIFICATION_DATA,
  REQUEST_NOTIFICATION_SERVICE,
} from '@requests/common/emp/components/request-notification-form/request-notification-form.provider';
import { canActivateRfiOrRdeRequestGuard } from '@requests/common/emp/guards';
import { rfiQuery } from '@requests/common/emp/request-for-information/+state';
import { RfiWizardSteps } from '@requests/common/emp/request-for-information/request-for-information.consts';
import {
  canActivateRfiNotificationForm,
  canActivateRfiRespondSuccess,
  canActivateRfiSubmit,
  canActivateRfiSuccess,
  canActivateRfiSummary,
  canDeactivateRdeSubmit,
} from '@requests/common/emp/request-for-information/request-for-information.guard';
import { RequestForInformationStore } from '@requests/common/emp/request-for-information/services';
import { backlinkResolver } from '@requests/common/task-navigation';

export const REQUEST_FOR_INFORMATION_ROUTES: Routes = [
  {
    path: 'submit',
    canActivate: [canActivateRfiSubmit],
    canDeactivate: [canDeactivateRdeSubmit],
    children: [
      {
        path: '',
        data: { backlink: '../../', breadcrumb: false },
        canActivate: [canActivateRfiSummary],
        loadComponent: () =>
          import('@requests/common/emp/request-for-information/request-for-information-summary').then(
            (c) => c.RequestForInformationSummaryComponent,
          ),
      },
      {
        path: RfiWizardSteps.RFI_REQUEST,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(RfiWizardSteps.SUMMARY, '../../'),
        },
        canActivate: [canActivateRfiOrRdeRequestGuard('../../not-allowed')],
        loadComponent: () =>
          import('@requests/common/emp/request-for-information/request-for-information-form').then(
            (c) => c.RequestForInformationFormComponent,
          ),
      },
      {
        path: RfiWizardSteps.RFI_NOTIFICATION,
        data: { breadcrumb: false },
        resolve: {
          backlink: backlinkResolver(RfiWizardSteps.SUMMARY, RfiWizardSteps.RFI_REQUEST),
        },
        providers: [
          { provide: REQUEST_NOTIFICATION_SERVICE, useExisting: RequestForInformationStore },
          {
            provide: REQUEST_NOTIFICATION_DATA,
            deps: [RequestForInformationStore],
            useFactory: (store: RequestForInformationStore) => store.select(rfiQuery.selectRfi),
          },
        ],
        canActivate: [canActivateRfiNotificationForm],
        loadComponent: () =>
          import('@requests/common/emp/components/request-notification-form').then(
            (c) => c.RequestNotificationFormComponent,
          ),
      },
      {
        path: RfiWizardSteps.SUCCESS,
        canActivate: [canActivateRfiSuccess],
        loadComponent: () =>
          import('@requests/common/emp/request-for-information/request-for-information-success').then(
            (c) => c.RequestForInformationSuccessComponent,
          ),
      },
    ],
  },
  {
    path: 'not-allowed',
    loadComponent: () =>
      import('@requests/common/emp/components/request-not-allowed').then((c) => c.RequestNotAllowedComponent),
  },
  {
    path: 'respond',
    children: [
      {
        path: RfiWizardSteps.SUCCESS,
        canActivate: [canActivateRfiRespondSuccess],
        loadComponent: () =>
          import('@requests/common/emp/request-for-information/request-for-information-respond-success').then(
            (c) => c.RequestForInformationRespondSuccessComponent,
          ),
      },
    ],
  },
];
