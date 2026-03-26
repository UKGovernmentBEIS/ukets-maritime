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

import { NotProvidedDirective } from '@shared/directives';
import { FollowUpRequest } from '@shared/types/follow-up-request.interface';

@Component({
  selector: 'mrtm-follow-up-request-summary-template',
  imports: [
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
  templateUrl: './follow-up-request-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpRequestSummaryTemplateComponent {
  readonly followUpRequest = input.required<FollowUpRequest>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
