import { Route } from '@angular/router';

export const NOTIFY_OPERATOR_PATH = 'notify-operator';

export const NOTIFY_OPERATOR_ROUTES: Route[] = [
  {
    path: '',
    title: 'Notify operator',
    data: { backlink: '../../', breadcrumb: false },
    loadComponent: () =>
      import('@requests/common/components/notify-operator/notify-operator-form').then(
        (c) => c.NotifyOperatorFormComponent,
      ),
  },
  {
    path: 'success',
    title: 'Task completed',
    data: { backlink: false, breadcrumb: 'Dashboard' },
    loadComponent: () =>
      import('@requests/common/components/notify-operator/notify-operator-success').then(
        (c) => c.NotifyOperatorSuccessComponent,
      ),
  },
];
