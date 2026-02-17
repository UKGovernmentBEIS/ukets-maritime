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

import { SummaryDownloadFilesComponent } from '@shared/components/summary-download-files/summary-download-files.component';
import { NotProvidedDirective } from '@shared/directives';
import { FollowUpAmends } from '@shared/types/follow-up-amends.interface';

@Component({
  selector: 'mrtm-follow-up-response-and-decision-summary-template',
  imports: [
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
    NotProvidedDirective,
    RouterLink,
    LinkDirective,
  ],
  standalone: true,
  templateUrl: './follow-up-response-and-decision-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpResponseAndDecisionSummaryTemplateComponent {
  readonly followUpAmends = input.required<FollowUpAmends>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
