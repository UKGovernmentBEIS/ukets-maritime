import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
import { HtmlDiffDirective, NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-emission-sources-summary-template',
  standalone: true,
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
    NotProvidedDirective,
  ],
  templateUrl: './emission-sources-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesSummaryTemplateComponent {
  @Input({ required: true }) emissionSources: EmpEmissionSources;
  @Input() originalEmissionSources: EmpEmissionSources;
  @Input({ required: true }) emissionSourcesMap: SubTaskListMap<EmpEmissionSources>;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
