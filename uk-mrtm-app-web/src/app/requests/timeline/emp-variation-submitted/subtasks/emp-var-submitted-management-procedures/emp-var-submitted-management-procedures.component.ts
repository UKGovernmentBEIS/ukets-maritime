import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpManagementProcedures } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empVariationSubmittedQuery } from '@requests/timeline/emp-variation-submitted/+state';
import { ManagementProceduresSummaryTemplateComponent } from '@shared/components';
import { AttachedFile, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures>;
  dataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
}

@Component({
  selector: 'mrtm-emp-var-submitted-management-procedures',
  standalone: true,
  imports: [PageHeadingComponent, ManagementProceduresSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  templateUrl: './emp-var-submitted-management-procedures.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpVarSubmittedManagementProceduresComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empVariationSubmittedQuery.selectManagementProcedures)();
    return {
      managementProcedures: managementProcedures,
      managementProceduresMap: managementProceduresMap,
      dataFlowFiles: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      riskAssessmentFiles: this.store.select(
        empVariationSubmittedQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
    };
  });
}
