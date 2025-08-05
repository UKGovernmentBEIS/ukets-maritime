import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { isNumber } from 'lodash-es';

import { FuelOriginTypeName } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ButtonDirective,
  CheckboxComponent,
  CheckboxesComponent,
  FieldsetDirective,
  GovukSelectOption,
  LegendDirective,
  LinkDirective,
  SelectComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY } from '@requests/+state';
import { EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form//emission-sources-and-fuel-types-used-form.helper';
import {
  addFuelDetailsFormControl,
  emissionSourcesAndFuelTypesUsedFormProvider,
} from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.provider';
import { FuelDetailsFormGroupModel } from '@requests/common/components/emissions/emission-sources-and-fuel-types-used-form/emission-sources-and-fuel-types-used-form.types';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import {
  emissionsShipSubtaskMap,
  emissionsSubtaskMap,
} from '@requests/common/components/emissions/emissions-subtask-list.map';
import { ShipStepTitlePipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { TASK_FORM } from '@requests/common/task-form.token';
import { sortMonitoringMethodsByText } from '@requests/common/utils';
import { WizardStepComponent } from '@shared/components';
import {
  EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS,
  EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS,
  EMISSION_SOURCES_TYPE_SELECT_ITEMS,
  monitoringMethodMap,
} from '@shared/constants';
import { AddAnotherDirective } from '@shared/directives';
import { FuelOriginTitlePipe } from '@shared/pipes';
import { AllFuels } from '@shared/types';
import { isAer, isLNG } from '@shared/utils';

@Component({
  selector: 'mrtm-emission-sources-and-fuel-types-used-form',
  standalone: true,
  imports: [
    ShipStepTitlePipe,
    WizardStepComponent,
    TextInputComponent,
    ReactiveFormsModule,
    SelectComponent,
    CheckboxesComponent,
    CheckboxComponent,
    KeyValuePipe,
    ButtonDirective,
    AddAnotherDirective,
    FieldsetDirective,
    LegendDirective,
    ReturnToShipsListTableComponent,
    LinkDirective,
    RouterLink,
  ],
  providers: [emissionSourcesAndFuelTypesUsedFormProvider],
  templateUrl: './emission-sources-and-fuel-types-used-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmissionSourcesAndFuelTypesUsedFormComponent {
  private readonly commonSubtaskStepsQuery = inject(REQUEST_TASK_COMMON_SUBTASK_STEPS_QUERY);
  protected readonly formGroup = inject(TASK_FORM);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RequestTaskStore);
  private readonly taskService = inject(TaskService);
  private readonly isChange = this.route.snapshot.queryParamMap.get('change') === 'true';

  readonly map = emissionsShipSubtaskMap;
  readonly typeOptions = EMISSION_SOURCES_TYPE_SELECT_ITEMS;
  readonly sourceClassOptions = EMISSION_SOURCES_SOURCE_CLASS_SELECT_ITEMS;
  readonly methaneSlipOptions: GovukSelectOption<
    FuelOriginTypeName['methaneSlip'] | FuelOriginTypeName['methaneSlipValueType']
  >[] = EMISSION_SOURCES_METHANE_SLIP_SELECT_ITEMS.sort((a, b) =>
    (isNumber(a) && isNumber(b) && a.value > b.value) || 'OTHER' === (a as any) ? -1 : 1,
  );
  readonly monitoringMethodMap = monitoringMethodMap;
  readonly sortMonitoringMethodsByText = sortMonitoringMethodsByText;
  readonly shipId: string = this.route.snapshot.params['shipId'];
  readonly fuelFactors = this.store.select(
    this.commonSubtaskStepsQuery.selectShipFuelsAndEmissionsFactors(this.shipId),
  )();
  private readonly fuelTitlePipe: FuelOriginTitlePipe = new FuelOriginTitlePipe();
  readonly shipName = this.store.select(this.commonSubtaskStepsQuery.selectShipName(this.shipId));

  private readonly taskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  readonly isAer = computed(() => isAer(this.taskType()));
  readonly heading = computed(() => {
    if (this.isAer()) {
      return this.isChange ? this.map.emissionsSourcesFormEdit.title : this.map.emissionsSourcesFormAdd.title;
    }
    return this.map.emissionsSources.title;
  });
  readonly returnToLabel = computed(() =>
    this.isAer() ? emissionsShipSubtaskMap.emissionsSources.title : emissionsSubtaskMap.title,
  );
  get fuelDetailsControl(): FormArray<FormGroup<FuelDetailsFormGroupModel>> {
    return this.formGroup.get('fuelDetails') as FormArray<FormGroup<FuelDetailsFormGroupModel>>;
  }

  fuelDetailsOptions(controlIndex: number): GovukSelectOption<string>[] {
    const usedUniqueIdentifiers: string[] = this.fuelDetailsControl.controls.map(
      (control) => control.get('uniqueIdentifier').value,
    );
    const currentFuels: string[] = [...(usedUniqueIdentifiers ?? [])].filter(
      (item) => item !== this.fuelDetailsControl.controls[controlIndex].get('uniqueIdentifier').value,
    );

    return this.fuelFactors
      .filter((fuelFactor) => !currentFuels.includes(fuelFactor.uniqueIdentifier))
      .map((fuelFactor) => ({
        value: fuelFactor.uniqueIdentifier,
        text: this.fuelTitlePipe.transform(fuelFactor),
      }));
  }

  addFuelDetails() {
    this.fuelDetailsControl.push(addFuelDetailsFormControl());
  }

  removeFuelDetails(index: number) {
    this.fuelDetailsControl.removeAt(index);
  }

  onChangeFuelDetails(i: number) {
    const fuelDetailsUniqueId: string = this.fuelDetailsControl.controls[i].get('uniqueIdentifier')?.value;
    const currentFuelFactor = this.fuelFactors.find(
      (item) => item.uniqueIdentifier === fuelDetailsUniqueId,
    ) as AllFuels;

    const methaneSlipCtrl = this.fuelDetailsControl.controls[i].get('methaneSlip') as unknown as FormControl;

    if (isLNG(currentFuelFactor)) {
      methaneSlipCtrl.enable();
    } else {
      methaneSlipCtrl.disable();
    }
    this.formGroup.updateValueAndValidity();
  }

  onChangeMethaneSlip(i: number) {
    const methaneSlipCtrl = this.fuelDetailsControl.controls[i].get('methaneSlip') as unknown as FormControl;
    const methaneSlipOtherCtrl = this.fuelDetailsControl.controls[i].get('methaneSlipOther') as unknown as FormControl;
    if (methaneSlipCtrl?.value === 'OTHER') {
      methaneSlipOtherCtrl.setValue(null);
      methaneSlipOtherCtrl.enable();
    } else {
      methaneSlipOtherCtrl.disable();
    }
    this.formGroup.updateValueAndValidity();
  }

  isLNGType(i: number) {
    const fuelDetailsUniqueId: string = this.fuelDetailsControl.controls[i].get('uniqueIdentifier')?.value;
    const currentFuelFactor = this.fuelFactors.find(
      (item) => item.uniqueIdentifier === fuelDetailsUniqueId,
    ) as AllFuels;
    return isLNG(currentFuelFactor);
  }

  onSubmit() {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, EMISSION_SOURCES_AND_FUEL_TYPES_USED_FORM_STEP, this.route, this.formGroup.value)
      .subscribe();
  }
}
