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
import { FollowUpResponseDTO } from '@shared/types';

@Component({
  selector: 'mrtm-follow-up-response-regulator-summary-template',
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
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './follow-up-response-regulator-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpResponseRegulatorSummaryTemplateComponent {
  readonly followUpResponseDTO = input.required<FollowUpResponseDTO>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
