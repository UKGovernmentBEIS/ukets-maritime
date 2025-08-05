import { Routes } from '@angular/router';

import { PendingRequestGuard } from '@core/guards/pending-request.guard';
import { FeedbackComponent } from '@feedback/feedback.component';
import { FeedbackSentComponent } from '@feedback/feedback-sent/feedback-sent.component';

export const FEEDBACK_ROUTES: Routes = [
  {
    path: '',
    title: 'Feedback',
    data: { breadcrumb: true },
    component: FeedbackComponent,
    canDeactivate: [PendingRequestGuard],
  },
  {
    path: 'sent',
    title: 'Feedback sent',
    data: { breadcrumb: true },
    component: FeedbackSentComponent,
  },
];
