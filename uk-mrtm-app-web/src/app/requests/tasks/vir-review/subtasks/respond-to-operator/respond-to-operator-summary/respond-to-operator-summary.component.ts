import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_OPERATOR_SUBTASK, virSubtaskList } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { virReviewQuery } from '@requests/tasks/vir-review/+state';
import { VirRespondToOperatorWizardStep } from '@requests/tasks/vir-review/subtasks/respond-to-operator/respond-to-operator.helpers';
import { VirRespondToRecommendationWizardStep } from '@requests/tasks/vir-submit/subtasks/respond-to-recommendation';
import {
  VirRegulatorResponseSummaryTemplateComponent,
  VirVerifierRecommendationSummaryTemplateComponent,
} from '@shared/components';
import { VirOperatorResponseSummaryTemplateComponent } from '@shared/components/summaries/vir-operator-response-summary-template';

@Component({
  selector: 'mrtm-respond-to-operator-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    VirVerifierRecommendationSummaryTemplateComponent,
    VirOperatorResponseSummaryTemplateComponent,
    VirRegulatorResponseSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './respond-to-operator-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RespondToOperatorSummaryComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly key = input<string>();
  public readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly isSubTaskCompleted = computed(
    () =>
      this.store.select(virReviewQuery.selectStatusForVerifierRecommendationData(this.key()))() ===
      TaskItemStatus.COMPLETED,
  );
  public readonly wizardStepMap = VirRespondToRecommendationWizardStep;
  public readonly verificationData = computed(() => {
    const key = this.key();
    const data = this.store.select(virCommonQuery.selectVirVerifierRecommendationDataByKey(key))();
    return {
      ...data,
      reference: `${data?.reference}: ${virSubtaskList[data?.verificationDataKey]?.title}`,
    };
  });

  public readonly operatorResponseData = computed(() =>
    this.store.select(virCommonQuery.selectOperatorResponseSummaryData(this.key()))(),
  );

  public readonly regulatorResponseData = computed(() =>
    this.store.select(virReviewQuery.selectRegulatorResponseData(this.key()))(),
  );

  public onSubmit(): void {
    this.service
      .saveSubtask(RESPOND_TO_OPERATOR_SUBTASK, VirRespondToOperatorWizardStep.SUMMARY, this.activatedRoute, this.key())
      .pipe(take(1))
      .subscribe();
  }
}
