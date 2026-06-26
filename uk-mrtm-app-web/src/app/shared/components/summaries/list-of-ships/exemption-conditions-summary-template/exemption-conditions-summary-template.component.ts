import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { ExemptionConditions } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-exemption-conditions-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    BooleanToTextPipe,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './exemption-conditions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExemptionConditionsSummaryTemplateComponent {
  readonly exemptionConditions = input.required<ExemptionConditions>();
  readonly originalExemptionConditions = input<ExemptionConditions>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
