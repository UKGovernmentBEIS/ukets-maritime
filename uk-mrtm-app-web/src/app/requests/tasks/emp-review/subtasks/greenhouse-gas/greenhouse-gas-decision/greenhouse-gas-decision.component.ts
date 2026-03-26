import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmpMonitoringGreenhouseGas } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpReviewTaskPayload } from '@requests/common/emp/emp.types';
import { GREENHOUSE_GAS_SUB_TASK, GreenhouseGasWizardStep } from '@requests/common/emp/subtasks/greenhouse-gas';
import { greenhouseGasMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components/review-decision';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { GreenhousesSummaryTemplateComponent, WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  greenhouseGas: EmpMonitoringGreenhouseGas;
  greenhouseGasMap: SubTaskListMap<EmpMonitoringGreenhouseGas & { decision: string }>;
  isEditable: boolean;
  wizardStep?: { [s: string]: string };
}

@Component({
  selector: 'mrtm-greenhouse-gas-decision',
  imports: [GreenhousesSummaryTemplateComponent, ReactiveFormsModule, WizardStepComponent, ReviewDecisionComponent],
  standalone: true,
  templateUrl: './greenhouse-gas-decision.component.html',
  providers: [reviewDecisionFormProvider(GREENHOUSE_GAS_SUB_TASK)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreenhouseGasDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly vm: Signal<ViewModel> = computed(() => ({
    greenhouseGas: this.store.select(empCommonQuery.selectGreenhouseGas)(),
    greenhouseGasMap: greenhouseGasMap,
    isEditable: this.store.select(requestTaskQuery.selectIsEditable)(),
    wizardStep: transformWizardStepDecision(GreenhouseGasWizardStep),
  }));

  onSubmit() {
    (this.service as EmpReviewService)
      .saveReviewDecision(
        GREENHOUSE_GAS_SUB_TASK,
        GreenhouseGasWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[GREENHOUSE_GAS_SUB_TASK],
      )
      .subscribe();
  }
}
