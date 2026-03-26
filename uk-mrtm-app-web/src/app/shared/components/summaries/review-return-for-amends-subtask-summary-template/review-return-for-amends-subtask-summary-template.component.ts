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
  imports: [
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  standalone: true,
  templateUrl: './review-return-for-amends-subtask-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewReturnForAmendsSubtaskSummaryTemplateComponent {
  readonly caption = input<string>();
  readonly reviewDecision = input.required<ReviewDecisionDto | EmpVariationReviewDecisionDto>();
  readonly showAssignee = input<boolean>(true);
}
