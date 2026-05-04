import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpEmissionSources } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { ProcedureFormPartialSummaryTemplateComponent } from '@shared/components/summaries/procedure-form-partial-summary-template';
import { HtmlDiffDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-emission-sources-summary-template',
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    SummaryListRowActionsDirective,
    ProcedureFormPartialSummaryTemplateComponent,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './emission-sources-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesSummaryTemplateComponent {
  readonly emissionSources = input.required<EmpEmissionSources>();
  readonly originalEmissionSources = input<EmpEmissionSources>();
  readonly emissionSourcesMap = input.required<SubTaskListMap<EmpEmissionSources>>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
