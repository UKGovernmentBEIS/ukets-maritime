import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { RdeResponsePayload } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

@Component({
  selector: 'mrtm-request-deadline-extension-decision-details-summary-template',
  imports: [
    RouterLink,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
  ],
  standalone: true,
  templateUrl: './request-deadline-extension-decision-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionDecisionDetailsSummaryTemplateComponent {
  readonly data = input.required<RdeResponsePayload>();
  readonly isEditable = input<boolean>();
  readonly changeLink = input<string>();
  readonly queryParams = input<Params>();
}
