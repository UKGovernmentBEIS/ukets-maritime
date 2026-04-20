import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AerVerificationReturnToOperatorRequestTaskActionPayload, TasksService } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import {
  BusinessErrorService,
  catchNotFoundRequest,
  catchTaskReassignedBadRequest,
  ErrorCodes,
  requestTaskReassignedError,
  taskNotFoundError,
} from '@netz/common/error';
import { PendingRequestService } from '@netz/common/services';
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

import {
  returnToOperatorForChangesQuery,
  ReturnToOperatorForChangesStore,
} from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state';

@Component({
  selector: 'mrtm-return-to-operator-for-changes-summary',
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
  templateUrl: './return-to-operator-for-changes-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToOperatorForChangesSummaryComponent {
  private readonly service = inject(TasksService);
  private readonly store = inject(ReturnToOperatorForChangesStore);
  private readonly requestTaskStore = inject(RequestTaskStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly pendingRequestService = inject(PendingRequestService);
  private readonly businessErrorService = inject(BusinessErrorService);

  readonly changesRequired = this.store.select(returnToOperatorForChangesQuery.selectChangesRequired);

  onSubmit() {
    this.service
      .processRequestTaskAction({
        requestTaskId: this.requestTaskStore.select(requestTaskQuery.selectRequestTaskId)(),
        requestTaskActionType: 'AER_VERIFICATION_RETURN_TO_OPERATOR',
        requestTaskActionPayload: {
          payloadType: 'AER_VERIFICATION_RETURN_TO_OPERATOR_PAYLOAD',
          changesRequired: this.changesRequired(),
        } as AerVerificationReturnToOperatorRequestTaskActionPayload,
      })
      .pipe(
        this.pendingRequestService.trackRequest(),
        catchNotFoundRequest(ErrorCodes.NOTFOUND1001, () =>
          this.businessErrorService.showErrorForceNavigation(taskNotFoundError),
        ),
        catchTaskReassignedBadRequest(() =>
          this.businessErrorService.showErrorForceNavigation(requestTaskReassignedError()),
        ),
      )
      .subscribe(() => {
        this.store.setIsSubmitted(true);
        this.router.navigate(['../success'], { relativeTo: this.route });
      });
  }
}
