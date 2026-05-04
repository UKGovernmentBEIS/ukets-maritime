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

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { FollowUpReviewDecisionTypePipe } from '@shared/pipes';
import { FollowUpReviewDecisionDTO } from '@shared/types';

@Component({
  selector: 'mrtm-follow-up-review-decision-summary-template',
  imports: [
    LinkDirective,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    GovukDatePipe,
    FollowUpReviewDecisionTypePipe,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './follow-up-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpReviewDecisionSummaryTemplateComponent {
  readonly followUpReviewDecision = input.required<FollowUpReviewDecisionDTO>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly showHeader = input(false);
  readonly queryParams = input<Params>({});
}
