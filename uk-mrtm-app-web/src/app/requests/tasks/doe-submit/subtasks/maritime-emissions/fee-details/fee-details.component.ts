import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { DateInputComponent, TextareaComponent, TextInputComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { maritimeEmissionsMap } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { feeDetailsFormProvider } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/fee-details/fee-details.form-provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-fee-details',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    TextInputComponent,
    DateInputComponent,
    TextareaComponent,
    CurrencyPipe,
  ],
  templateUrl: './fee-details.component.html',
  providers: [feeDetailsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeeDetailsComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<DoeTaskPayload> = inject(TaskService<DoeTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly maritimeEmissionsMap = maritimeEmissionsMap;

  private totalBillableHours = toSignal(this.form.controls.totalBillableHours.valueChanges, {
    initialValue: this.form.controls.totalBillableHours.value,
  });
  private totalHourlyRate = toSignal(this.form.controls.hourlyRate.valueChanges, {
    initialValue: this.form.controls.hourlyRate.value,
  });
  totalOperatorFee = computed(() => this.totalBillableHours() * this.totalHourlyRate());

  onSubmit() {
    this.service
      .saveSubtask(MARITIME_EMISSIONS_SUB_TASK, MaritimeEmissionsWizardStep.FEE_DETAILS, this.route, this.form.value)
      .subscribe();
  }
}
