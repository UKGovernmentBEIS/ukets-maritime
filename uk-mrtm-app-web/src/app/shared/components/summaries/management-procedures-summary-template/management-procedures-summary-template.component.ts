import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpManagementProcedures, EmpMonitoringReportingRole } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { ProcedureFormPartialSummaryTemplateComponent } from '@shared/components/summaries/procedure-form-partial-summary-template';
import { HtmlDiffDirective } from '@shared/directives';
import { AttachedFile, SubTaskListMap } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-management-procedures-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    LinkDirective,
    RouterLink,
    SummaryDownloadFilesComponent,
    ProcedureFormPartialSummaryTemplateComponent,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './management-procedures-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresSummaryTemplateComponent {
  readonly managementProcedures = input.required<EmpManagementProcedures>();
  readonly originalManagementProcedures = input<EmpManagementProcedures>();
  readonly managementProceduresMap = input.required<SubTaskListMap<EmpManagementProcedures>>();
  readonly dataFlowFiles = input.required<AttachedFile[]>();
  readonly originalDataFlowFiles = input<AttachedFile[]>();
  readonly riskAssessmentFiles = input.required<AttachedFile[]>();
  readonly originalRiskAssessmentFiles = input<AttachedFile[]>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});

  readonly combinedMonitoringReportingRoles = computed(() =>
    mergeDiffArray<EmpMonitoringReportingRole>(
      this.managementProcedures()?.monitoringReportingRoles,
      this.originalManagementProcedures()?.monitoringReportingRoles,
    ),
  );
}
