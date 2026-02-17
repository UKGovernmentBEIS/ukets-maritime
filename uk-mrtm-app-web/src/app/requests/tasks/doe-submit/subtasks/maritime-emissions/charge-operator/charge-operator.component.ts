import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { maritimeEmissionsMap } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { chargeOperatorFormProvider } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/charge-operator/charge-operator.form-provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-charge-operator',
  imports: [RadioComponent, WizardStepComponent, ReactiveFormsModule, RadioOptionComponent],
  standalone: true,
  templateUrl: './charge-operator.component.html',
  providers: [chargeOperatorFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChargeOperatorComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<DoeTaskPayload> = inject(TaskService<DoeTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  protected readonly maritimeEmissionsMap = maritimeEmissionsMap;

  onSubmit() {
    this.service
      .saveSubtask(
        MARITIME_EMISSIONS_SUB_TASK,
        MaritimeEmissionsWizardStep.CHARGE_OPERATOR,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
