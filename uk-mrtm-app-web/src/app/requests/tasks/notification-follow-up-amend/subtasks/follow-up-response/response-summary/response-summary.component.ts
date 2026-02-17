import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { followUpAmendQuery } from '@requests/tasks/notification-follow-up-amend/+state';
import { FollowUpAmendTaskPayload } from '@requests/tasks/notification-follow-up-amend/follow-up-amend.types';
import {
  FOLLOW_UP_RESPONSE_SUB_TASK,
  ResponseWizardStep,
} from '@requests/tasks/notification-follow-up-amend/subtasks/follow-up-response/response.helper';
import { FollowUpResponseSummaryTemplateComponent } from '@shared/components/summaries/follow-up-response-summary-template';
import { FollowUpResponse } from '@shared/types/follow-up-response.interface';

@Component({
  selector: 'mrtm-response-summary',
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    FollowUpResponseSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './response-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResponseSummaryComponent {
  private readonly service = inject(TaskService<FollowUpAmendTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  readonly changeLink = ResponseWizardStep.FOLLOW_UP_RESPONSE;

  readonly vm: Signal<FollowUpResponse> = computed(() => ({
    response: this.store.select(followUpAmendQuery.selectPayload)().followUpResponse,
    request: this.store.select(followUpAmendQuery.selectPayload)().followUpRequest,
    attachments: this.store.select(
      followUpAmendQuery.selectAttachedFiles(this.store.select(followUpAmendQuery.selectFollowUpFiles)()),
    )(),
  }));

  readonly isStatusSetByDefault = computed(() => {
    return !this.store.select(followUpAmendQuery.selectPayload)().sectionsCompleted['followUpResponse'];
  });

  onSubmit() {
    this.service.submitSubtask(FOLLOW_UP_RESPONSE_SUB_TASK, ResponseWizardStep.SUMMARY, this.route).subscribe();
  }
}
