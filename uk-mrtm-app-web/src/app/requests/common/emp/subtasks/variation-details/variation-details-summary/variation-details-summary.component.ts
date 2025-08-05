import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EmpVariationDetails } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { empCommonQuery, empVariationQuery, empVariationRegulatorQuery } from '@requests/common/emp/+state';
import { EmpVariationTaskPayload } from '@requests/common/emp/emp.types';
import { variationDetailsSubtaskMap } from '@requests/common/emp/subtasks/subtask-list.map';
import {
  VARIATION_DETAILS_SUB_TASK,
  VariationDetailsWizardStep,
} from '@requests/common/emp/subtasks/variation-details/variation-details.helper';
import { TaskItemStatus } from '@requests/common/task-item-status';
import { VariationDetailsSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-variation-details-summary',
  standalone: true,
  imports: [
    ButtonDirective,
    VariationDetailsSummaryTemplateComponent,
    PageHeadingComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './variation-details-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariationDetailsSummaryComponent {
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly taskService: TaskService<EmpVariationTaskPayload> = inject(TaskService<EmpVariationTaskPayload>);

  isEditable: boolean = this.store.select(requestTaskQuery.selectIsEditable)();
  isCompleted: boolean =
    this.store.select(empCommonQuery.selectStatusForSubtask(VARIATION_DETAILS_SUB_TASK))() === TaskItemStatus.COMPLETED;
  variationDetails: EmpVariationDetails = this.store.select(empVariationQuery.selectEmpVariationDetails)();
  detailsData: EmpVariationDetails = this.store.select(empVariationQuery.selectEmpVariationDetails)();
  isVariationRegulator = this.store.select(empCommonQuery.selectIsVariationRegulator)();
  regulatorLedReason = this.store.select(empVariationRegulatorQuery.selectReasonRegulatorLed)();
  taskMap: SubTaskListMap<Pick<EmpVariationTaskPayload, 'empVariationDetails'>> = variationDetailsSubtaskMap;
  wizardStep = VariationDetailsWizardStep;

  onSubmit() {
    this.taskService
      .submitSubtask(VARIATION_DETAILS_SUB_TASK, VariationDetailsWizardStep.SUMMARY, this.activatedRoute)
      .subscribe();
  }
}
