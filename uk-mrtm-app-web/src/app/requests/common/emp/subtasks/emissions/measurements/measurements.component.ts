import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  CheckboxComponent,
  CheckboxesComponent,
  DetailsComponent,
  FieldsetDirective,
  LegendDirective,
  TextInputComponent,
} from '@netz/govuk-components';

import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ShipStepTitlePipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { EmissionsWizardStep } from '@requests/common/emp/subtasks/emissions/emissions.helpers';
import {
  addMeasurementDescriptionGroup,
  measurementsFormProvider,
} from '@requests/common/emp/subtasks/emissions/measurements/measurements.form-provider';
import {
  MeasurementDescriptionFormGroup,
  MeasurementsFormModel,
} from '@requests/common/emp/subtasks/emissions/measurements/measurements.types';
import { emissionShipSubtasksMap } from '@requests/common/emp/subtasks/subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { AddAnotherDirective } from '@shared/directives';

@Component({
  selector: 'mrtm-measurements',
  standalone: true,
  imports: [
    WizardStepComponent,
    ShipStepTitlePipe,
    DetailsComponent,
    FieldsetDirective,
    LegendDirective,
    ReactiveFormsModule,
    TextInputComponent,
    CheckboxesComponent,
    CheckboxComponent,
    AddAnotherDirective,
    ButtonDirective,
    ReturnToShipsListTableComponent,
  ],
  templateUrl: './measurements.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [measurementsFormProvider],
})
export class MeasurementsComponent {
  protected readonly formGroup = inject<FormGroup<MeasurementsFormModel>>(TASK_FORM);
  private readonly taskService: TaskService<EmpTaskPayload> = inject(TaskService<EmpTaskPayload>);
  private readonly route = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);

  taskMap = emissionShipSubtasksMap;
  shipId = this.route.snapshot.params['shipId'];
  emissionSourcesNames = this.store.select(empCommonQuery.selectShipEmissionSourcesNames(this.shipId))();
  readonly shipName = this.store.select(empCommonQuery.selectShipName(this.shipId))();

  get measurementsFormArray(): FormArray<MeasurementDescriptionFormGroup> {
    return this.formGroup.controls.measurements;
  }

  removeMeasurementDescription(index: number) {
    this.measurementsFormArray.removeAt(index);
  }

  addFuelDetails() {
    this.measurementsFormArray.push(addMeasurementDescriptionGroup());
  }

  onSubmit() {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EmissionsWizardStep.MEASUREMENTS, this.route, {
        ...this.formGroup.value,
        shipId: this.shipId,
      })
      .subscribe();
  }
}
