import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpShipEmissions } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

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
  ],
  standalone: true,
  templateUrl: './exemption-conditions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExemptionConditionsSummaryTemplateComponent {
  public readonly data = input.required<EmpShipEmissions['exemptionConditions']>();
  readonly changeLink = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
