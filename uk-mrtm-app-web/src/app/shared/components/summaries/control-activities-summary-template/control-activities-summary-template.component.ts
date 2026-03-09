import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './control-activities-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlActivitiesSummaryTemplateComponent {
  @Input({ required: true }) controlActivities: EmpControlActivities;
  @Input() originalControlActivities: EmpControlActivities;
  @Input({ required: true }) controlActivitiesMap: SubTaskListMap<EmpControlActivities>;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
