import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
import { FollowUpResponse } from '@shared/types/follow-up-response.interface';

@Component({
  selector: 'mrtm-follow-up-response-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    SummaryListRowActionsDirective,
    SummaryDownloadFilesComponent,
    NotProvidedDirective,
  ],
  standalone: true,
  templateUrl: './follow-up-response-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpResponseSummaryTemplateComponent {
  readonly followUpResponse = input.required<FollowUpResponse>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
