import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './exemption-conditions-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExemptionConditionsSummaryTemplateComponent {
  @Input({ required: true }) public data: EmpShipEmissions['exemptionConditions'];
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
