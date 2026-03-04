import { ChangeDetectionStrategy, Component, computed, input, Signal } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import {
  AerInPersonSiteVisit,
  AerMonitoringPlanChanges,
  AerMonitoringPlanVersion,
  AerOpinionStatement,
  AerTotalEmissions,
} from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { OpinionStatementStep } from '@requests/common/aer/subtasks/opinion-statement/opinion-statement.helpers';
import { opinionStatementMap } from '@requests/common/aer/subtasks/opinion-statement/opinion-statement-subtask-list.map';
import {
  AerEmissionsOverviewSummaryTemplateComponent,
  MonitoringPlanVersionSummaryTemplateComponent,
} from '@shared/components/summaries';
import { NotProvidedDirective } from '@shared/directives';
import { AerSiteVisitTypeToLabelPipe, BooleanToTextPipe } from '@shared/pipes';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-opinion-statement-summary-template',
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    NotProvidedDirective,
    AerSiteVisitTypeToLabelPipe,
    AerEmissionsOverviewSummaryTemplateComponent,
    MonitoringPlanVersionSummaryTemplateComponent,
    GovukDatePipe,
  ],
  standalone: true,
  templateUrl: './opinion-statement-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionStatementSummaryTemplateComponent {
  readonly opinionStatement = input.required<AerOpinionStatement>();
  readonly totalEmissions = input.required<AerTotalEmissions>();
  readonly monitoringPlanChanges = input.required<AerMonitoringPlanChanges>();
  readonly monitoringPlanVersion = input.required<AerMonitoringPlanVersion>();
  readonly map = opinionStatementMap;
  readonly wizardStep = OpinionStatementStep;

  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly isNil = isNil;

  readonly teamMembersList: Signal<string[]> = computed(() => {
    const siteVisit = this.opinionStatement()?.siteVisit as AerInPersonSiteVisit;
    if (siteVisit?.type === 'IN_PERSON') {
      return siteVisit?.teamMembers?.split(',').map((member) => member.trim());
    }
    return [];
  });
}
