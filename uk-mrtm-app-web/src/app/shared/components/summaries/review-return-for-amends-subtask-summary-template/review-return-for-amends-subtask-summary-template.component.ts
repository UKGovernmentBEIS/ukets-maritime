import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { EmpVariationReviewDecisionDto, ReviewDecisionDto } from '@shared/types';

@Component({
  selector: 'mrtm-review-return-for-amends-subtask-summary-template',
  standalone: true,
  imports: [
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './review-return-for-amends-subtask-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewReturnForAmendsSubtaskSummaryTemplateComponent {
  caption = input<string>();
  reviewDecision = input.required<ReviewDecisionDto | EmpVariationReviewDecisionDto>();
  showAssignee = input<boolean>(true);
}
