import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { SelectComponent } from '@netz/govuk-components';

import { peerReviewActionPayloadMap } from '@requests/common/components/peer-review/peer-review-action-payload.map';
import { sendForPeerReviewFormProvider } from '@requests/common/components/peer-review/send-for-peer-review/send-for-peer-review.form-provider';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { NotifyUsersService } from '@shared/services';

@Component({
  selector: 'mrtm-send-for-peer-review',
  imports: [WizardStepComponent, ReactiveFormsModule, SelectComponent],
  standalone: true,
  templateUrl: './send-for-peer-review.component.html',
  providers: [sendForPeerReviewFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SendForPeerReviewComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly notifyUsersService: NotifyUsersService = inject(NotifyUsersService);

  requestTaskType = this.store.select(requestTaskQuery.selectRequestTaskType)();
  actionPayloadMap = peerReviewActionPayloadMap[this.requestTaskType];
  requestTaskId = this.store.select(requestTaskQuery.selectRequestTaskId)();
  currentAssigneeId = this.store.select(requestTaskQuery.selectAssigneeUserId)();
  pendingRfi = this.store
    .select(requestTaskQuery.selectRelatedTasks)()
    ?.some((task) => task.taskType.endsWith('WAIT_FOR_RFI_RESPONSE'));
  readonly assignees = toSignal(
    this.notifyUsersService.getAssigneesByTaskType(
      this.currentAssigneeId,
      this.requestTaskId,
      this.actionPayloadMap.assigneesRequestTaskType,
    ),
  );

  onSubmit() {
    this.notifyUsersService
      .submitForPeerReview(
        this.requestTaskId,
        this.form.get('assignees').value,
        this.actionPayloadMap.requestTaskActionType,
        this.actionPayloadMap.payloadType,
      )
      .subscribe(() => {
        const assignedToText = this.assignees().find(
          (assignee) => assignee.value === this.form.get('assignees').value,
        )?.text;
        this.router.navigate(['success'], {
          relativeTo: this.route,
          state: {
            assignedTo: assignedToText,
          },
          skipLocationChange: true,
        });
      });
  }
}
