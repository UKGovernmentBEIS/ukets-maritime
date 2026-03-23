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
  standalone: true,
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
  templateUrl: './request-deadline-extension-decision-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionDecisionDetailsSummaryTemplateComponent {
  data = input.required<RdeResponsePayload>();
  isEditable = input<boolean>();
  changeLink = input<string>();
  queryParams = input<Params>();
}
