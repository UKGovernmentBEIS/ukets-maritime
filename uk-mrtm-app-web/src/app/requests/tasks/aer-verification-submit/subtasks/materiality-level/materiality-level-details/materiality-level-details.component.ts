import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { MATERIALITY_LEVEL_SUB_TASK, materialityLevelMap, MaterialityLevelStep } from '@requests/common/aer';
import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { materialityLevelDetailsFormProvider } from '@requests/tasks/aer-verification-submit/subtasks/materiality-level/materiality-level-details/materiality-level-details.form-provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-materiality-level-details',
  standalone: true,
  imports: [TextareaComponent, ReactiveFormsModule, WizardStepComponent],
  templateUrl: './materiality-level-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [materialityLevelDetailsFormProvider],
})
export class MaterialityLevelDetailsComponent {
  readonly map = materialityLevelMap;
  readonly formGroup = inject<FormGroup>(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(TaskService<AerVerificationSubmitTaskPayload>);

  onSubmit() {
    this.service
      .saveSubtask(MATERIALITY_LEVEL_SUB_TASK, MaterialityLevelStep.DETAILS, this.route, this.formGroup.value)
      .pipe(take(1))
      .subscribe();
  }
}
