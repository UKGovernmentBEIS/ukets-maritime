import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpControlActivities } from '@mrtm/api';

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
  selector: 'mrtm-control-activities-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    LinkDirective,
    BooleanToTextPipe,
    ProcedureFormPartialSummaryTemplateComponent,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './control-activities-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesSummaryTemplateComponent {
  readonly controlActivities = input.required<EmpControlActivities>();
  readonly originalControlActivities = input<EmpControlActivities>();
  readonly controlActivitiesMap = input.required<SubTaskListMap<EmpControlActivities>>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
