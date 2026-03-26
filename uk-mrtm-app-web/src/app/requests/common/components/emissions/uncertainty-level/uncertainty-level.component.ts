import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { UncertaintyLevel } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { GovukSelectOption, LabelDirective, SelectComponent, TextInputComponent } from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { emissionsShipSubtaskMap, emissionsSubtaskMap } from '@requests/common/components/emissions';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { ShipStepTitleCustomPipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { uncertaintyLevelFormProvider } from '@requests/common/components/emissions/uncertainty-level/uncertainty-level.form-provider';
import { UNCERTAINTY_LEVEL_STEP } from '@requests/common/components/emissions/uncertainty-level/uncertainty-level.helpers';
import { UncertaintyLevelFormModel } from '@requests/common/components/emissions/uncertainty-level/uncertainty-level.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { METHOD_APPROACH_SELECT_OPTIONS, monitoringMethodMap } from '@shared/constants';
import { SelectOptionToTitlePipe } from '@shared/pipes';
import { isAer } from '@shared/utils';

@Component({
  selector: 'mrtm-uncertainty-level',
  imports: [
    ShipStepTitleCustomPipe,
    WizardStepComponent,
    ReactiveFormsModule,
    SelectComponent,
    TextInputComponent,
    SelectOptionToTitlePipe,
    ReturnToShipsListTableComponent,
    LabelDirective,
  ],
  standalone: true,
  templateUrl: './uncertainty-level.component.html',
  providers: [uncertaintyLevelFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncertaintyLevelComponent implements OnInit {
  protected readonly formGroup: FormGroup = inject<FormGroup>(TASK_FORM);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly taskService = inject(TaskService);
  private readonly store = inject(RequestTaskStore);
  private readonly commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
  private readonly taskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  readonly isAer = computed(() => isAer(this.taskType()));
  readonly returnToLabel = computed(() => (this.isAer() ? emissionsSubtaskMap.ships.title : emissionsSubtaskMap.title));
  methodApproachOptions: GovukSelectOption<UncertaintyLevel['methodApproach']>[] = METHOD_APPROACH_SELECT_OPTIONS;
  monitoringMethodMap = monitoringMethodMap;
  taskMap = emissionsShipSubtaskMap;
  shipId = this.route.snapshot.params['shipId'];
  readonly shipName = this.store.select(this.commonSubtaskStepsQuery.selectShipName(this.shipId))();

  get uncertaintyLevelFormArray(): UncertaintyLevelFormModel['uncertaintyLevels'] {
    return this.formGroup.get('uncertaintyLevels') as FormArray;
  }

  getMethodName(index: number): string {
    const monitoringMethodValue = this.uncertaintyLevelFormArray?.controls?.[index]?.controls?.monitoringMethod?.value;

    return monitoringMethodMap[monitoringMethodValue]?.text;
  }

  getMethodAccessibilitySuffix(index: number): string {
    return ` for ${this.getMethodName(index)}`;
  }

  ngOnInit() {
    for (const formGroup of this.uncertaintyLevelFormArray.controls) {
      formGroup
        .get('methodApproach')
        .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((methodApproach: UncertaintyLevel['methodApproach']) => {
          const valueControl = formGroup.get('value');
          valueControl.reset(methodApproach === 'DEFAULT' ? '7.5' : null);
          methodApproach === 'DEFAULT' ? valueControl.disable() : valueControl.enable();
        });
    }
  }

  onSubmit() {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, UNCERTAINTY_LEVEL_STEP, this.route, this.formGroup.getRawValue())
      .subscribe();
  }
}
