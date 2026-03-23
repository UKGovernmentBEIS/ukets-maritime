import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { isNil } from 'lodash-es';

import { EmpOperatorDetails, RegisteredOwnerShipDetails } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective, WarningTextComponent } from '@netz/govuk-components';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import {
  hasNeedsReviewRegisteredOwners,
  MANDATE_SUB_TASK,
  MandateWizardStep,
  validateAllIsmShipsHaveRegisteredOwner,
} from '@requests/common/emp/subtasks/mandate';
import { mandateMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { subtaskReviewGroupMap } from '@requests/common/emp/utils';
import { transformWizardStepDecision } from '@requests/common/emp/utils/transform-wizard-step-decision';
import {
  REVIEW_DECISION_FORM,
  ReviewDecisionComponent,
  ReviewDecisionFormModel,
  reviewDecisionFormProvider,
} from '@requests/tasks/emp-review/components';
import { EmpReviewService } from '@requests/tasks/emp-review/services';
import { MandateSummaryTemplateComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-mandate-decision',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    ReviewDecisionComponent,
    WarningTextComponent,
    LinkDirective,
    MandateSummaryTemplateComponent,
  ],
  providers: [
    reviewDecisionFormProvider(MANDATE_SUB_TASK, [
      validateAllIsmShipsHaveRegisteredOwner,
      hasNeedsReviewRegisteredOwners,
    ]),
  ],
  templateUrl: './mandate-decision.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateDecisionComponent {
  protected readonly form: ReviewDecisionFormModel = inject(REVIEW_DECISION_FORM);
  private readonly service: TaskService<EmpReviewTaskPayload> = inject(TaskService<EmpReviewTaskPayload>);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  public readonly isEditable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly mandate = this.store.select(empCommonQuery.selectExtendedMandate);
  public readonly operatorName: Signal<EmpOperatorDetails['operatorName']> = computed(
    () => this.store.select(empCommonQuery.selectOperatorDetails)()?.operatorName,
  );
  public readonly hasNeedsReviewItems: Signal<boolean> = computed(
    () => !isNil(this.mandate()?.registeredOwners.find((ro) => ro.needsReview === true)),
  );

  public allShipsAssociated: Signal<boolean> = computed(() => {
    const ismShips = this.store.select(empCommonQuery.selectIsmShipImoNumbers)();
    const registeredOwnersShips = new Set<RegisteredOwnerShipDetails['imoNumber']>(
      (this.mandate()?.registeredOwners ?? [])
        .map((registeredOwner) => registeredOwner.ships.map((ship) => ship.imoNumber))
        .flat(),
    );

    return registeredOwnersShips.size === ismShips.size;
  });
  public readonly wizardMap = mandateMap;
  public readonly wizardStep = transformWizardStepDecision(MandateWizardStep);

  public onSubmit(): void {
    (this.service as EmpReviewService)
      .saveReviewDecision(
        MANDATE_SUB_TASK,
        MandateWizardStep.DECISION,
        this.route,
        this.form.value,
        subtaskReviewGroupMap[MANDATE_SUB_TASK],
      )
      .subscribe();
  }

  protected readonly mandateMap = mandateMap;
}
