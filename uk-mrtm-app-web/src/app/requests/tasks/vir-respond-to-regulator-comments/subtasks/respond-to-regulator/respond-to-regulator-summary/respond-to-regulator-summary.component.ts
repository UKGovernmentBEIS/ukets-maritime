import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { TaskItemStatus } from '@requests/common';
import { RESPOND_TO_REGULATOR_SUBTASK, virSubtaskList } from '@requests/common/vir';
import { virCommonQuery } from '@requests/common/vir/+state';
import { virRespondToRegulatorCommentsQuery } from '@requests/tasks/vir-respond-to-regulator-comments/+state';
import { VirRespondToRegulatorService } from '@requests/tasks/vir-respond-to-regulator-comments/services';
import { VirRespondToRegulatorWizardStep } from '@requests/tasks/vir-respond-to-regulator-comments/subtasks/respond-to-regulator';
import {
  VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent,
  VirRegulatorResponseOperatorSideSummaryTemplateComponent,
  VirVerifierRecommendationSummaryTemplateComponent,
} from '@shared/components';
import { VirOperatorResponseSummaryTemplateComponent } from '@shared/components/summaries/vir-operator-response-summary-template';

@Component({
  selector: 'mrtm-respond-to-regulator-summary',
  imports: [
    ButtonDirective,
    VirVerifierRecommendationSummaryTemplateComponent,
    PageHeadingComponent,
    VirOperatorResponseSummaryTemplateComponent,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
    VirRegulatorResponseOperatorSideSummaryTemplateComponent,
    VirOperatorResponseToRegulatorCommentsSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './respond-to-regulator-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RespondToRegulatorSummaryComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service: VirRespondToRegulatorService = inject(TaskService) as VirRespondToRegulatorService;
  private readonly activatedRoute = inject(ActivatedRoute);

  public readonly key = input<string>();
  public readonly isEditable = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly isSubTaskCompleted = computed(
    () =>
      this.store.select(
        virRespondToRegulatorCommentsQuery.selectStatusForOperatorImprovementResponseData(this.key()),
      )() === TaskItemStatus.COMPLETED,
  );
  public readonly wizardStepMap = VirRespondToRegulatorWizardStep;
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
    this.store.select(virRespondToRegulatorCommentsQuery.selectRegulatorResponseData(this.key()))(),
  );

  public readonly operatorImprovementResponse = computed(() =>
    this.store.select(virRespondToRegulatorCommentsQuery.selectOperatorImprovementResponseData(this.key()))(),
  );

  public onSubmit(): void {
    this.service
      .saveOperatorImprovement(
        RESPOND_TO_REGULATOR_SUBTASK,
        VirRespondToRegulatorWizardStep.SUMMARY,
        this.activatedRoute,
        this.key(),
        this.key(),
      )
      .pipe(take(1))
      .subscribe();
  }
}
