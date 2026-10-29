import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';

export const REQUEST_FEEDBACK_ROUTES: Routes = [
  {
    path: '',
    title: 'Give feedback',
    canDeactivate: [PendingRequestGuard],
    loadComponent: () =>
      import('@feedback/request-feedback/request-feedback-form/request-feedback-form.component').then(
        (c) => c.RequestFeedbackFormComponent,
      ),
  },
  {
    path: 'sent',
    title: 'Feedback sent',
    loadComponent: () =>
      import('@feedback/request-feedback/request-feedback-sent/request-feedback-sent.component').then(
        (c) => c.RequestFeedbackSentComponent,
      ),
  },
];
