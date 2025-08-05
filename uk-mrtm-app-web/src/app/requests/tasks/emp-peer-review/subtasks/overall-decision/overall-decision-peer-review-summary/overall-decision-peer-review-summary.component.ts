import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empReviewQuery } from '@requests/common/emp/+state';
import { overallDecisionMap, OverallDecisionWizardStep } from '@requests/common/emp/subtasks/overall-decision';
import { OverallDecisionSummaryTemplateComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

interface ViewModel {
  determination: EmpIssuanceDetermination;
  overallDecisionMap: SubTaskListMap<{ actions: string; question: string }>;
  isEditable: boolean;
  isSubTaskCompleted: boolean;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-overall-decision-peer-review-summary',
  standalone: true,
  imports: [PageHeadingComponent, ReturnToTaskOrActionPageComponent, OverallDecisionSummaryTemplateComponent],
  templateUrl: './overall-decision-peer-review-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverallDecisionPeerReviewSummaryComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  vm: Signal<ViewModel> = computed(() => ({
    determination: this.store.select(empReviewQuery.selectDetermination)(),
    overallDecisionMap: overallDecisionMap,
    isEditable: false,
    isSubTaskCompleted: this.store.select(empReviewQuery.selectIsOverallDecisionCompleted)(),
    wizardStep: OverallDecisionWizardStep,
  }));
}
