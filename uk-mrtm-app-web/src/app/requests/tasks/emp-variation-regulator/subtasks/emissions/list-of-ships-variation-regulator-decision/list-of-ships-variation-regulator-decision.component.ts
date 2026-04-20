import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import {
  empCommonQuery,
  empVariationRegulatorQuery,
  EmpVariationRegulatorTaskPayload,
  TaskItemStatus,
} from '@requests/common';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionsSubTasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  VARIATION_REGULATOR_DECISION_FORM,
  VariationRegulatorDecisionComponent,
  VariationRegulatorDecisionFormModel,
  variationRegulatorDecisionFormProvider,
} from '@requests/tasks/emp-variation-regulator/components';
import { EmpVariationRegulatorService } from '@requests/tasks/emp-variation-regulator/services';
import { NotificationBannerComponent, WizardStepComponent } from '@shared/components';
import { NotificationBannerStore } from '@shared/components/notification-banner';
import { ListOfShipsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-list-of-ships-variation-regulator-decision',
  standalone: true,
  imports: [
    ListOfShipsSummaryTemplateComponent,
    RouterLink,
    LinkDirective,
    ReactiveFormsModule,
    WizardStepComponent,
    VariationRegulatorDecisionComponent,
    NotificationBannerComponent,
    WarningTextComponent,
    ButtonDirective,
  ],
  templateUrl: './list-of-ships-variation-regulator-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [variationRegulatorDecisionFormProvider(EMISSIONS_SUB_TASK)],
})
export class ListOfShipsVariationRegulatorDecisionComponent {
  protected readonly form: VariationRegulatorDecisionFormModel = inject(VARIATION_REGULATOR_DECISION_FORM);

  private readonly formGroup = new UntypedFormGroup({});
  private readonly notificationBannerStore = inject(NotificationBannerStore);

  private readonly store = inject(RequestTaskStore);
  private readonly service = inject<TaskService<EmpVariationRegulatorTaskPayload>>(TaskService);
  private readonly route = inject(ActivatedRoute);

  readonly ships = this.store.select(empCommonQuery.selectListOfShips);
  readonly originalShips = this.store.select(empVariationRegulatorQuery.selectOriginalListOfShips);
  readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  readonly wizardStep = transformWizardStepDecision(EmissionsWizardStep);
  readonly emissionsSubTasksMap = emissionsSubTasksMap;

  readonly notCompletedMessage = computed<string>(() => {
    const notCompleted: boolean = this.ships()?.some((ship) => ship.status !== TaskItemStatus.COMPLETED);
    return notCompleted ? 'Enter the missing details for all entries with the status ‘Incomplete’' : undefined;
  });

  onContinueAttempt() {
    if (this.notCompletedMessage()) {
      this.formGroup.setErrors({ NOT_COMPLETED: this.notCompletedMessage() });
      this.notificationBannerStore.setInvalidForm(this.formGroup);
    } else {
      this.formGroup.reset();
      this.notificationBannerStore.reset();
    }
  }

  onSubmit() {
    (this.service as EmpVariationRegulatorService)
      .saveVariationRegulatorDecision(
        EMISSIONS_SUB_TASK,
        EmissionsWizardStep.VARIATION_REGULATOR_DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[EMISSIONS_SUB_TASK],
      )
      .subscribe();
  }
}
