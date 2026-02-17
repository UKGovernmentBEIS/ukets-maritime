import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpManagementProcedures } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { managementProceduresMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { empSubmittedQuery } from '@requests/timeline/emp-submitted/+state';
import {
  ManagementProceduresSummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { AttachedFile, EmpVariationReviewDecisionDto, SubTaskListMap } from '@shared/types';

interface ViewModel {
  managementProcedures: EmpManagementProcedures;
  managementProceduresMap: SubTaskListMap<EmpManagementProcedures>;
  dataFlowFiles: AttachedFile[];
  riskAssessmentFiles: AttachedFile[];
  reviewGroupDecision?: EmpVariationReviewDecisionDto | null;
}

@Component({
  selector: 'mrtm-management-procedures-submitted',
  imports: [
    PageHeadingComponent,
    ManagementProceduresSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './management-procedures-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ManagementProceduresSubmittedComponent {
  private readonly store: RequestActionStore = inject(RequestActionStore);

  readonly vm: Signal<ViewModel> = computed(() => {
    const managementProcedures = this.store.select(empSubmittedQuery.selectManagementProcedures)();
    return {
      managementProcedures: managementProcedures,
      managementProceduresMap: managementProceduresMap,
      dataFlowFiles: this.store.select(
        empSubmittedQuery.selectAttachedFiles(managementProcedures?.dataFlowActivities?.files),
      )(),
      riskAssessmentFiles: this.store.select(
        empSubmittedQuery.selectAttachedFiles(managementProcedures?.riskAssessmentProcedures?.files),
      )(),
      reviewGroupDecision: this.store.select(empSubmittedQuery.selectReviewGroupDecision('managementProcedures'))(),
    };
  });
}
