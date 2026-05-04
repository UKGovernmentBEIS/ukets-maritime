import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe, NotificationReviewDecisionTypePipe } from '@shared/pipes';
import { NotificationReviewDecisionUnion } from '@shared/types';

@Component({
  selector: 'mrtm-notification-review-decision-summary-template',
  imports: [
    GovukDatePipe,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    NotificationReviewDecisionTypePipe,
    BooleanToTextPipe,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './notification-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationReviewDecisionSummaryTemplateComponent {
  readonly reviewDecision = input.required<NotificationReviewDecisionUnion>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
