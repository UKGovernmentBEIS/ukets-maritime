import { I18nSelectPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RadioComponent, RadioOptionComponent, TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { maritimeEmissionsMap } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';
import {
  MARITIME_EMISSIONS_SUB_TASK,
  MaritimeEmissionsWizardStep,
} from '@requests/tasks/doe-submit/subtasks/maritime-emissions';
import { determinationReasonFormProvider } from '@requests/tasks/doe-submit/subtasks/maritime-emissions/determination-reason/determination-reason.form-provider';
import { WizardStepComponent } from '@shared/components';
import { determineReasonTypeMap } from '@shared/types';

@Component({
  selector: 'mrtm-determination-reason',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    I18nSelectPipe,
  ],
  templateUrl: './determination-reason.component.html',
  providers: [determinationReasonFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeterminationReasonComponent {
  protected readonly form: UntypedFormGroup = inject(TASK_FORM);
  private readonly service: TaskService<DoeTaskPayload> = inject(TaskService<DoeTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  readonly maritimeEmissionsMap = maritimeEmissionsMap;
  readonly determineReasonTypeMap = determineReasonTypeMap;
  readonly determineReasonTypeOptions: string[] = Object.keys(determineReasonTypeMap);

  onSubmit() {
    this.service
      .saveSubtask(
        MARITIME_EMISSIONS_SUB_TASK,
        MaritimeEmissionsWizardStep.DETERMINATION_REASON,
        this.route,
        this.form.value,
      )
      .subscribe();
  }
}
