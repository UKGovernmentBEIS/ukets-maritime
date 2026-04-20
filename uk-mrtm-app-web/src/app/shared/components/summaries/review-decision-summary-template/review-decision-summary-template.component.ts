import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

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
import { ReviewDecisionTypePipe } from '@shared/pipes';
import { EmpVariationReviewDecisionDto, ReviewDecisionDto } from '@shared/types';

@Component({
  selector: 'mrtm-review-decision-summary-template',
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
    NotProvidedDirective,
    ReviewDecisionTypePipe,
  ],
  templateUrl: './review-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDecisionSummaryTemplateComponent {
  @Input({ required: true }) reviewDecision: ReviewDecisionDto | EmpVariationReviewDecisionDto;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  public readonly isPermittedUser = input<boolean>(true);
}
