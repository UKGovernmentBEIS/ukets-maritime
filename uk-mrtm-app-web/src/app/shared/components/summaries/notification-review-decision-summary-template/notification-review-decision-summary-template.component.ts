import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './notification-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationReviewDecisionSummaryTemplateComponent {
  @Input({ required: true }) reviewDecision: NotificationReviewDecisionUnion;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
