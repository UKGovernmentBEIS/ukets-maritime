import { ChangeDetectionStrategy, Component, input } from '@angular/core';
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
  standalone: true,
  templateUrl: './variation-regulator-decision-partial-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationRegulatorDecisionPartialSummaryTemplateComponent {
  readonly variationDecisionDetails = input.required<EmpAcceptedVariationDecisionDetails>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
  readonly showNotes = input<boolean>(true);
}
