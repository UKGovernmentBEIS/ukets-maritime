import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { followUpQuery } from '@requests/tasks/notification-follow-up/+state';
import { FollowUpTaskPayload } from '@requests/tasks/notification-follow-up/follow-up.types';
import {
  FOLLOW_UP_RESPONSE_SUB_TASK,
  FollowUpResponseWizardStep,
} from '@requests/tasks/notification-follow-up/subtasks/follow-up-response/follow-up-response.helper';
import { FollowUpResponseSummaryTemplateComponent } from '@shared/components/summaries/follow-up-response-summary-template';
import { FollowUpResponse } from '@shared/types/follow-up-response.interface';

@Component({
  selector: 'mrtm-follow-up-response-summary',
  imports: [
    PageHeadingComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
    FollowUpResponseSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './follow-up-response-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpResponseSummaryComponent {
  private readonly service: TaskService<FollowUpTaskPayload> = inject(TaskService<FollowUpTaskPayload>);
  private readonly store = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  readonly changeLink = FollowUpResponseWizardStep.FOLLOW_UP_RESPONSE;

  readonly vm: Signal<FollowUpResponse> = computed(() => ({
    response: this.store.select(followUpQuery.selectPayload)().followUpResponse,
    request: this.store.select(followUpQuery.selectPayload)().followUpRequest,
    attachments: this.store.select(
      followUpQuery.selectAttachedFiles(this.store.select(followUpQuery.selectFollowUpFiles)()),
    )(),
  }));

  onSubmit() {
    this.service.submitSubtask(FOLLOW_UP_RESPONSE_SUB_TASK, FollowUpResponseWizardStep.SUMMARY, this.route).subscribe();
  }
}
