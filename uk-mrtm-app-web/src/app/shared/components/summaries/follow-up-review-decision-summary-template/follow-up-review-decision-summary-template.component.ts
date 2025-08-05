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

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { FollowUpReviewDecisionTypePipe } from '@shared/pipes';
import { FollowUpReviewDecisionDTO } from '@shared/types';

@Component({
  selector: 'mrtm-follow-up-review-decision-summary-template',
  standalone: true,
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
  templateUrl: './follow-up-review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpReviewDecisionSummaryTemplateComponent {
  @Input({ required: true }) followUpReviewDecision: FollowUpReviewDecisionDTO;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() showHeader = false;
  @Input() queryParams: Params = {};
}
