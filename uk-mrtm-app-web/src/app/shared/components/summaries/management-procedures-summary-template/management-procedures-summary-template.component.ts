import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './management-procedures-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresSummaryTemplateComponent {
  @Input({ required: true }) managementProcedures: EmpManagementProcedures;
  @Input() originalManagementProcedures: EmpManagementProcedures;
  @Input({ required: true }) managementProceduresMap: SubTaskListMap<EmpManagementProcedures>;
  @Input({ required: true }) dataFlowFiles: AttachedFile[];
  @Input() originalDataFlowFiles: AttachedFile[];
  @Input({ required: true }) riskAssessmentFiles: AttachedFile[];
  @Input() originalRiskAssessmentFiles: AttachedFile[];
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};

  combinedMonitoringReportingRoles = computed(() =>
    mergeDiffArray<EmpMonitoringReportingRole>(
      this.managementProcedures?.monitoringReportingRoles,
      this.originalManagementProcedures?.monitoringReportingRoles,
    ),
  );
}
