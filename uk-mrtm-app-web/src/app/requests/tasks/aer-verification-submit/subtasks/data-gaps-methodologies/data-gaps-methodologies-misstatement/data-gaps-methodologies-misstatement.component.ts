import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import {
  DATA_GAPS_METHODOLOGIES_SUB_TASK,
  dataGapsMethodologiesMap,
  DataGapsMethodologiesStep,
} from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { dataGapsMethodologiesMisstatementProvider } from '@requests/tasks/aer-verification-submit/subtasks/data-gaps-methodologies/data-gaps-methodologies-misstatement/data-gaps-methodologies-misstatement.form-provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-data-gaps-methodologies-misstatement',
  standalone: true,
  imports: [
    ConditionalContentDirective,
    RadioComponent,
    RadioOptionComponent,
    ReactiveFormsModule,
    TextareaComponent,
    WizardStepComponent,
  ],
  templateUrl: './data-gaps-methodologies-misstatement.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [dataGapsMethodologiesMisstatementProvider],
})
export class DataGapsMethodologiesMisstatementComponent {
  readonly map = dataGapsMethodologiesMap;
  readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);

  onSubmit() {
    this.service
      .saveSubtask(
        DATA_GAPS_METHODOLOGIES_SUB_TASK,
        DataGapsMethodologiesStep.MATERIAL_MISSTATEMENT,
        this.route,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }
}
