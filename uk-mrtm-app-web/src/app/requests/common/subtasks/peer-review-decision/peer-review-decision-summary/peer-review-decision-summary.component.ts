import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { EmpPeerReviewTaskPayload } from '@requests/common/emp/emp.types';
import {
  PEER_REVIEW_DECISION_SUB_TASK,
  PeerReviewWizardStep,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.helper';
import {
  PEER_REVIEW_DECISION_SELECTOR,
  PEER_REVIEW_DECISION_STATUS_SELECTOR,
  PEER_REVIEW_DECISION_TEXT_MAP,
} from '@requests/common/subtasks/peer-review-decision/peer-review-decision.providers';
import { TaskItemStatus } from '@requests/common/task-item-status';

interface ViewModel {
  decision: EmpPeerReviewTaskPayload['decision'];
  status: TaskItemStatus;
  wizardStep: { [s: string]: string };
}

@Component({
  selector: 'mrtm-peer-review-summary',
  standalone: true,
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    SummaryListRowActionsDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './peer-review-decision-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeerReviewDecisionSummaryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<EmpPeerReviewTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly decisionSelector = inject(PEER_REVIEW_DECISION_SELECTOR);
  private readonly decisionStatusSelector = inject(PEER_REVIEW_DECISION_STATUS_SELECTOR);
  readonly map = inject(PEER_REVIEW_DECISION_TEXT_MAP);

  vm: Signal<ViewModel> = computed(() => ({
    decision: this.store.select(this.decisionSelector)(),
    status: this.store.select(this.decisionStatusSelector)(),
    wizardStep: PeerReviewWizardStep,
  }));

  onSubmit() {
    this.service.submitSubtask(PEER_REVIEW_DECISION_SUB_TASK, PeerReviewWizardStep.SUMMARY, this.route).subscribe();
  }
}
