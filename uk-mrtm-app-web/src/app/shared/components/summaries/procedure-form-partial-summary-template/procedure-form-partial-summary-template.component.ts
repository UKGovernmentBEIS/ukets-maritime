import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpProcedureForm, EmpProcedureFormWithFiles } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-procedure-form-partial-summary-template',
  imports: [
    LinkDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    SummaryListComponent,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './procedure-form-partial-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcedureFormPartialSummaryTemplateComponent {
  readonly procedureForm = input.required<EmpProcedureForm | EmpProcedureFormWithFiles>();
  readonly a11yActionsText = input.required<string>();
  readonly originalProcedureForm = input<EmpProcedureForm | EmpProcedureFormWithFiles>();
  readonly currentWizardStep = input<string>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
  readonly cssClass = input<string | null>(null);
}
