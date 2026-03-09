import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { AerSmf } from '@mrtm/api';

import { ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { RadioComponent, RadioOptionComponent } from '@netz/govuk-components';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerEmissionsShipMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import {
  AER_REDUCTION_CLAIM_SUB_TASK,
  ReductionClaimWizardStep,
} from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.helpers';
import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.map';
import { reductionClaimExistFormProvider } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-exist/reduction-claim-exist.form-provider';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-reduction-claim-exist',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReturnToTaskOrActionPageComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
  ],
  providers: [reductionClaimExistFormProvider],
  templateUrl: './reduction-claim-exist.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReductionClaimExistComponent {
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly formGroup: FormGroup = inject(TASK_FORM);
  public readonly wizardMap: SubTaskListMap<AerSmf> = reductionClaimMap;

  public onSubmit(): void {
    this.service
      .saveSubtask(
        AER_REDUCTION_CLAIM_SUB_TASK,
        ReductionClaimWizardStep.EXIST,
        this.activatedRoute,
        this.formGroup.value,
      )
      .pipe(take(1))
      .subscribe();
  }

  protected readonly map = aerEmissionsShipMap;
}
