import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmpIssuanceReviewDecision, EmpVariationReviewDecision } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { EmpReviewDecisionDtoBase } from '@shared/types';

@Component({
  selector: 'mrtm-emp-review-return-for-amends-subtask-summary-template',
  standalone: true,
  imports: [
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
  ],
  templateUrl: './emp-review-return-for-amends-subtask-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent {
  caption = input<string>();
  reviewDecision =
    input.required<EmpReviewDecisionDtoBase<EmpVariationReviewDecision['type'] | EmpIssuanceReviewDecision['type']>>();
  showAssignee = input<boolean>(true);
}
