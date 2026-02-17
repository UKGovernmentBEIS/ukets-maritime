import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RdeDecisionPayload, RdeForceDecisionPayload } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { rdeDetailsQuery } from '@requests/common/emp/request-deadline-extension/+state/request-deadline-details.selectors';
import { requestDeadlineExtensionDecisionFormProvider } from '@requests/common/emp/request-deadline-extension/request-deadline-extension-decision/request-deadline-extension-decision-form.provider';
import { RequestDeadlineExtensionApiService } from '@requests/common/emp/request-deadline-extension/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';
import { RequestDeadlineExtensionDecisionDetailsSummaryTemplateComponent } from '@shared/components/summaries/request-deadline-extension-decision-details-summary-template/request-deadline-extension-decision-details-summary-template.component';

@Component({
  selector: 'mrtm-request-deadline-extension-decision',
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    RequestDeadlineExtensionDecisionDetailsSummaryTemplateComponent,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    MultipleFileInputComponent,
    ConditionalContentDirective,
  ],
  standalone: true,
  templateUrl: './request-deadline-extension-decision.component.html',
  providers: [requestDeadlineExtensionDecisionFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionDecisionComponent {
  public readonly formGroup = inject(TASK_FORM);
  private readonly taskStore = inject(RequestTaskStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rdeService = inject(RequestDeadlineExtensionApiService);
  private readonly requestTaskStore: RequestTaskStore = inject(RequestTaskStore);

  public readonly downloadUrl = this.taskStore.select(empCommonQuery.selectTasksDownloadUrl)();
  public readonly rdeDetails = this.taskStore.select(rdeDetailsQuery.selectResponseDetails);
  public readonly isRegulatorTask = this.taskStore.select(rdeDetailsQuery.selectIsRegulatorTask);
  public readonly isEditable = this.requestTaskStore.select(requestTaskQuery.selectIsEditable)();

  public onSubmit(): void {
    this.rdeService
      .submit(
        this.isRegulatorTask()
          ? {
              rdeForceDecisionPayload: {
                decision: this.formGroup.value?.decision,
                evidence: this.formGroup.value?.evidence,
                files: this.formGroup.value?.files?.map((file) => file.uuid),
              } as RdeForceDecisionPayload,
            }
          : {
              rdeDecisionPayload: {
                decision: this.formGroup.value?.decision,
                reason: this.formGroup.value?.reason,
              } as RdeDecisionPayload,
            },
      )
      .subscribe(() => {
        this.router.navigate(['rde', 'decision', 'success'], {
          relativeTo: this.route,
          state: {
            decision: this.formGroup.get('decision').value,
          },
        });
      });
  }
}
