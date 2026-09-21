import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RfiSubmitPayload } from '@mrtm/api';

import { AuthStore, selectUserId } from '@netz/common/auth';
import { RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  DateInputComponent,
  FieldsetDirective,
  LegendDirective,
  TextareaComponent,
} from '@netz/govuk-components';

import { empCommonQuery } from '@requests/common/emp/+state';
import { RfiWizardSteps } from '@requests/common/emp/request-for-information/request-for-information.consts';
import {
  addQuestion,
  requestForInformationFormProvider,
} from '@requests/common/emp/request-for-information/request-for-information-form/request-for-information-form.provider';
import {
  RequestForInformationApiService,
  RequestForInformationStore,
} from '@requests/common/emp/request-for-information/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';
import { UploadedFile } from '@shared/types';
import { createFileUploadPayload } from '@shared/utils';

@Component({
  selector: 'mrtm-request-for-information-form',
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    MultipleFileInputComponent,
    DateInputComponent,
    TextareaComponent,
    ButtonDirective,
    FieldsetDirective,
    LegendDirective,
  ],
  standalone: true,
  templateUrl: './request-for-information-form.component.html',
  providers: [requestForInformationFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationFormComponent {
  protected readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly taskStore = inject(RequestTaskStore);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rfiStore = inject(RequestForInformationStore);
  private readonly rfiService = inject(RequestForInformationApiService);

  public readonly downloadUrl = this.taskStore.select(empCommonQuery.selectTasksDownloadUrl)();

  get questionsCtr(): FormArray {
    return this.formGroup.get('questions') as FormArray;
  }

  onSubmit(): void {
    const rfiPayload: RfiSubmitPayload = {
      ...this.rfiStore.state?.rfiSubmitPayload,
      ...this.formGroup.value,
    };

    // The RFI details are persisted on the task so that the document preview of the notification step can be
    // generated from them. The backend requires a signatory, which the user has not selected yet at this step,
    // so it defaults to the current user (the same default the notification form uses).
    this.rfiService
      .save({
        ...rfiPayload,
        files: createFileUploadPayload((rfiPayload.files ?? []) as unknown as UploadedFile[]),
        signatory: rfiPayload.signatory ?? this.authStore.select(selectUserId)(),
        operators: rfiPayload.operators ?? [],
      })
      .subscribe(() => {
        this.rfiStore.setRfi(rfiPayload);
        this.router.navigate(['../', RfiWizardSteps.RFI_NOTIFICATION], { relativeTo: this.route });
      });
  }

  removeQuestion(index: number): void {
    this.questionsCtr.removeAt(index);
  }

  addQuestion(): void {
    this.questionsCtr.push(addQuestion());
  }
}
