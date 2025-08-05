import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PeerReviewDecision, RequestTaskActionProcessDTO, TasksService } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { PeerReviewDecisionState } from '@requests/tasks/notification-peer-review/+state/peer-review.state';
import { PeerReviewStore } from '@requests/tasks/notification-peer-review/+state/peer-review.store';
import { peerReviewDecisionQuery } from '@requests/tasks/notification-peer-review/+state/peer-review-decision.selectors';

interface ViewModel {
  peerReviewDecision: PeerReviewDecisionState;
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
  private readonly service = inject(TasksService);
  private readonly peerReviewStore = inject(PeerReviewStore);
  private readonly requestTaskStore = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  vm: Signal<ViewModel> = computed(() => ({
    peerReviewDecision: this.peerReviewStore.select(peerReviewDecisionQuery.selectDecision)(),
    isSubTaskCompleted: false,
  }));

  onSubmit() {
    const decision: PeerReviewDecision = {
      type: this.vm().peerReviewDecision.accepted ? 'AGREE' : 'DISAGREE',
      notes: this.vm().peerReviewDecision.notes,
    };
    this.service
      .processRequestTaskAction({
        requestTaskId: this.requestTaskStore.select(requestTaskQuery.selectRequestTaskId)(),
        requestTaskActionType: 'EMP_NOTIFICATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION',
        requestTaskActionPayload: {
          payloadType: 'EMP_NOTIFICATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_PAYLOAD',
          decision,
        },
      } as RequestTaskActionProcessDTO)
      .subscribe(() => {
        this.peerReviewStore.setIsDecisionSubmitted(true);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
  }
}
