import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { DecisionNotification } from '@mrtm/api';

import { PreviewDocument, RelatedDocumentsComponent } from '@netz/common/components';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { CheckboxComponent, CheckboxesComponent, SelectComponent } from '@netz/govuk-components';

import {
  REQUEST_NOTIFICATION_PREVIEW_DOCUMENTS_ACTION,
  REQUEST_NOTIFICATION_SERVICE,
  requestNotificationFormProvider,
} from '@requests/common/emp/components/request-notification-form/request-notification-form.provider';
import {
  RequestNotificationFormModel,
  RequestNotificationModel,
  RequestNotificationService,
} from '@requests/common/emp/components/request-notification-form/request-notification-form.types';
import { injectRequestPreviewDocuments } from '@requests/common/emp/utils';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { UserInfoResolverPipe } from '@shared/pipes';
import { NotifyUsersService } from '@shared/services';

@Component({
  selector: 'mrtm-request-notification-form',
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    KeyValuePipe,
    UserInfoResolverPipe,
    CheckboxesComponent,
    CheckboxComponent,
    SelectComponent,
    RelatedDocumentsComponent,
  ],
  standalone: true,
  templateUrl: './request-notification-form.component.html',
  providers: [requestNotificationFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestNotificationFormComponent {
  protected readonly formGroup: FormGroup<RequestNotificationFormModel> = inject<FormGroup>(TASK_FORM);
  private readonly taskStore = inject(RequestTaskStore);
  private readonly service: RequestNotificationService =
    inject<RequestNotificationService>(REQUEST_NOTIFICATION_SERVICE);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notifyUsersService: NotifyUsersService = inject(NotifyUsersService);
  private readonly previewDocumentsAction: string = inject(REQUEST_NOTIFICATION_PREVIEW_DOCUMENTS_ACTION, {
    optional: true,
  });

  readonly accountId = this.taskStore.select(requestTaskQuery.selectRequestTaskAccountId)();
  readonly requestTaskId = this.taskStore.select(requestTaskQuery.selectRequestTaskId)();

  readonly previewDocuments: Signal<PreviewDocument[]> = injectRequestPreviewDocuments(this.previewDocumentsAction);

  readonly allOperatorsInfo = toSignal(this.notifyUsersService.getAllOperatorsInfo(this.accountId));
  readonly assignees = toSignal(this.notifyUsersService.getAssignees(this.requestTaskId));

  /** The current form value shaped as the decision notification the document preview is generated for. */
  get decisionNotification(): DecisionNotification {
    const { signatory, operators } = this.formGroup.value;

    return { signatory, operators: operators ?? [], externalContacts: [] };
  }

  onSubmit(): void {
    this.service.setNotification(this.formGroup.value as RequestNotificationModel);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
