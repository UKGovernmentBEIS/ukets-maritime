import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './procedure-form-partial-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcedureFormPartialSummaryTemplateComponent {
  @Input({ required: true }) procedureForm: EmpProcedureForm | EmpProcedureFormWithFiles;
  @Input() originalProcedureForm: EmpProcedureForm | EmpProcedureFormWithFiles;
  @Input() currentWizardStep: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
  @Input() cssClass: string | null = null;
}
