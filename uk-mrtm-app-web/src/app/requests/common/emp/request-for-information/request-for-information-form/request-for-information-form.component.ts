import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
import { RequestForInformationStore } from '@requests/common/emp/request-for-information/services';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';
import { AddAnotherDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-request-for-information-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WizardStepComponent,
    MultipleFileInputComponent,
    DateInputComponent,
    TextareaComponent,
    AddAnotherDirective,
    ButtonDirective,
    FieldsetDirective,
    LegendDirective,
  ],
  providers: [requestForInformationFormProvider],
  templateUrl: './request-for-information-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationFormComponent {
  protected readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly taskStore = inject(RequestTaskStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly rfiStore = inject(RequestForInformationStore);

  public readonly downloadUrl = this.taskStore.select(empCommonQuery.selectTasksDownloadUrl)();

  get questionsCtr(): FormArray {
    return this.formGroup.get('questions') as FormArray;
  }

  onSubmit(): void {
    this.rfiStore.setRfi({
      ...this.rfiStore.state?.rfiSubmitPayload,
      ...this.formGroup.value,
    });
    this.router.navigate(['../', RfiWizardSteps.RFI_NOTIFICATION], { relativeTo: this.route });
  }

  removeQuestion(index: number): void {
    this.questionsCtr.removeAt(index);
  }

  addQuestion(): void {
    this.questionsCtr.push(addQuestion());
  }
}
