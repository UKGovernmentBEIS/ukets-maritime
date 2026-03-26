import { ChangeDetectionStrategy, Component, effect, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import {
  CheckboxComponent,
  CheckboxesComponent,
  RadioComponent,
  RadioOptionComponent,
  TextareaComponent,
} from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ShipStepTitleCustomPipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { carbonCaptureFormProvider } from '@requests/common/emp/subtasks/emissions/carbon-capture/carbon-capture.form-provider';
import {
  CarbonCaptureFormModel,
  EmpCarbonCaptureFormModel,
  EmpCarbonCaptureTechnologiesFormModel,
} from '@requests/common/emp/subtasks/emissions/carbon-capture/carbon-capture.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import { emissionShipSubtasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { MultipleFileInputComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-carbon-capture',
  imports: [
    WizardStepComponent,
    ShipStepTitleCustomPipe,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    TextareaComponent,
    MultipleFileInputComponent,
    CheckboxesComponent,
    CheckboxComponent,
    ReturnToShipsListTableComponent,
  ],
  standalone: true,
  templateUrl: './carbon-capture.component.html',
  providers: [carbonCaptureFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarbonCaptureComponent {
  protected readonly formGroup = inject<FormGroup<CarbonCaptureFormModel>>(TASK_FORM);
  private readonly taskService: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  readonly taskMap = emissionShipSubtasksMap;
  readonly shipId = this.route.snapshot.params['shipId'];
  readonly emissionSourcesNames = this.store.select(empCommonQuery.selectShipEmissionSourcesNames(this.shipId))();
  downloadUrl = this.store.select(empCommonQuery.selectTasksDownloadUrl)();
  readonly existCtrlValue: Signal<boolean> = toSignal(this.existCtrl.valueChanges, {
    initialValue: this.existCtrl.value,
  });
  readonly shipName = this.store.select(empCommonQuery.selectShipName(this.shipId))();

  constructor() {
    effect(() => {
      if (this.existCtrlValue()) {
        this.technologiesFormGroup.enable();
        this.formGroup.updateValueAndValidity({ emitEvent: true });
      } else {
        this.technologiesFormGroup.disable();
        this.technologiesFormGroup.reset();
        this.formGroup.updateValueAndValidity({ emitEvent: true });
      }
    });
  }

  get existCtrl(): EmpCarbonCaptureFormModel['exist'] {
    return this.formGroup.controls.carbonCapture.controls.exist;
  }

  get technologiesFormGroup(): FormGroup<EmpCarbonCaptureTechnologiesFormModel> {
    return this.formGroup.controls.carbonCapture.controls.technologies;
  }

  onSubmit() {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.CARBON_CAPTURE, this.route, {
        ...this.formGroup.value,
        shipId: this.shipId,
      })
      .subscribe();
  }
}
