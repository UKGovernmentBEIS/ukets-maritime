import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RequestTaskActionProcessDTO, TasksService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  BusinessErrorService,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { ItemNamePipe } from '@netz/common/pipes';
import { PendingRequestService } from '@netz/common/services';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';
import { ButtonDirective } from '@netz/govuk-components';

import { CANCEL_ACTIONS_MAP, CancelActionsMap } from '../cancel-actions.providers';

@Component({
  selector: 'netz-cancel-task',
  imports: [PendingButtonDirective, PageHeadingComponent, ButtonDirective, ItemNamePipe],
  standalone: true,
  template: `
    <netz-page-heading size="xl" [caption]="taskType() | itemName: getYearFromRequestId(requestId())">
      Are you sure you want to cancel this task?
    </netz-page-heading>
    <p class="govuk-body">This task and its data will be deleted.</p>
    <div class="govuk-button-group">
      <button type="button" netzPendingButton (click)="cancelTask()" govukWarnButton>Yes, cancel this task</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelComponent {
  private readonly cancelActionsMap: CancelActionsMap = inject(CANCEL_ACTIONS_MAP);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly tasksService: TasksService = inject(TasksService);
  private readonly businessErrorService: BusinessErrorService = inject(BusinessErrorService);
  private readonly pendingRequest: PendingRequestService = inject(PendingRequestService);

  readonly taskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  readonly requestId = this.store.select(requestTaskQuery.selectRequestId);
  private readonly resolvedActionType = computed(() => this.cancelActionsMap[this.taskType()].actionType);
  readonly getYearFromRequestId = getYearFromRequestId;

  cancelTask(): void {
    this.processRequestTaskAction(this.resolvedActionType(), this.store.select(requestTaskQuery.selectRequestTaskId)())
      .pipe(
        this.pendingRequest.trackRequest(),
        catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
        ),
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
      )
      .subscribe(() => this.router.navigate(['confirmation'], { relativeTo: this.route }));
  }

  private processRequestTaskAction(taskType: RequestTaskActionProcessDTO['requestTaskActionType'], taskId: number) {
    return this.tasksService.processRequestTaskAction({
      requestTaskActionType: taskType,
      requestTaskId: taskId,
      requestTaskActionPayload: {
        payloadType: 'EMPTY_PAYLOAD',
      },
    });
  }
}
