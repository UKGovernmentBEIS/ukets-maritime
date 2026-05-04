import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params } from '@angular/router';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { FollowUpReviewDecisionDTO } from '@shared/types';

@Component({
  selector: 'mrtm-follow-up-amends-details-summary-template',
  imports: [
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './follow-up-amends-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpAmendsDetailsSummaryTemplateComponent {
  readonly followUpReviewDecision = input.required<FollowUpReviewDecisionDTO>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
