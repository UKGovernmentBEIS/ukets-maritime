import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpAcceptedVariationDecisionDetails } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { NotProvidedDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-variation-regulator-decision-partial-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListRowActionsDirective,
  ],
  templateUrl: './variation-regulator-decision-partial-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationRegulatorDecisionPartialSummaryTemplateComponent {
  @Input({ required: true }) variationDecisionDetails: EmpAcceptedVariationDecisionDetails;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
