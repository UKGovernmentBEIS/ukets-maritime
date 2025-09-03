import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { EmpMandate } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, LinkDirective } from '@netz/govuk-components';

import { empCommonQuery, empReviewQuery, empVariationReviewQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { MANDATE_SUB_TASK, MandateWizardStep } from '@requests/common/emp/subtasks/mandate/mandate.helper';
import { mandateSubtaskMap } from '@requests/common/emp/subtasks/mandate/mandate-subtask-list.map';
import {
  MandateRegisteredOwnersListSummaryTemplateComponent,
  MandateResponsibilityDeclarationSummaryTemplateComponent,
  MandateResponsibilitySummaryTemplateComponent,
  ReviewDecisionSummaryTemplateComponent,
} from '@shared/components';
import { EmpVariationReviewDecisionDto } from '@shared/types';

@Component({
  selector: 'mrtm-mandate-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    MandateResponsibilitySummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
    PendingButtonDirective,
    ButtonDirective,
    MandateRegisteredOwnersListSummaryTemplateComponent,
    RouterLink,
    LinkDirective,
    MandateResponsibilityDeclarationSummaryTemplateComponent,
    ReviewDecisionSummaryTemplateComponent,
  ],
  templateUrl: './mandate-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MandateSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<EmpTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly wizardStep = MandateWizardStep;
  public readonly wizardMap = mandateSubtaskMap;
  public readonly mandate: Signal<EmpMandate> = this.store.select(empCommonQuery.selectMandate);
  public readonly isEditable: Signal<boolean> = this.store.select(requestTaskQuery.selectIsEditable);
  public readonly hasReview: Signal<boolean> = this.store.select(empCommonQuery.selectHasReview);
  public readonly isSubtaskCompleted: Signal<boolean> = computed(() =>
    this.hasReview()
      ? this.store.select(empReviewQuery.selectIsSubtaskCompleted(MANDATE_SUB_TASK))()
      : this.store.select(empCommonQuery.selectIsSubtaskCompleted(MANDATE_SUB_TASK))(),
  );
  public readonly reviewDecision: Signal<EmpVariationReviewDecisionDto> = this.store.select(
    empVariationReviewQuery.selectEmpReviewDecisionDTO(MANDATE_SUB_TASK),
  );

  public onSubmit(): void {
    this.service
      .submitSubtask(MANDATE_SUB_TASK, this.wizardStep.SUMMARY, this.activatedRoute)
      .pipe(take(1))
      .subscribe();
  }
}
