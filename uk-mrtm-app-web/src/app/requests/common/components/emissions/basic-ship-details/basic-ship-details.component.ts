import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { startWith } from 'rxjs';

import { ShipDetails } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import {
  ConditionalContentDirective,
  RadioComponent,
  RadioOptionComponent,
  SelectComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { emissionsShipSubtaskMap } from '@requests/common/components/emissions';
import { basicShipDetailsFormProvider } from '@requests/common/components/emissions/basic-ship-details/basic-ship-details.form-provider';
import {
  BASIC_SHIP_DETAILS_STEP,
  shouldShowHasIceClassDerogation,
} from '@requests/common/components/emissions/basic-ship-details/basic-ship-details.helpers';
import { EMISSIONS_SUB_TASK } from '@requests/common/components/emissions/emissions.helpers';
import { emissionsSubtaskMap } from '@requests/common/components/emissions/emissions-subtask-list.map';
import { ShipStepTitlePipe } from '@requests/common/components/emissions/pipes';
import { ReturnToShipsListTableComponent } from '@requests/common/components/emissions/return-to-ships-list-table';
import { TASK_FORM } from '@requests/common/task-form.token';
import { DatePickerComponent, WizardStepComponent } from '@shared/components';
import { SHIP_FLAG_SELECT_ITEMS, SHIP_ICE_CLASS_SELECT_ITEMS, SHIP_TYPE_SELECT_ITEMS } from '@shared/constants';
import { isAer } from '@shared/utils';

@Component({
  selector: 'mrtm-basic-ship-details',
  standalone: true,
  imports: [
    ConditionalContentDirective,
    WizardStepComponent,
    TextInputComponent,
    ReactiveFormsModule,
    RadioComponent,
    RadioOptionComponent,
    SelectComponent,
    ShipStepTitlePipe,
    ReturnToShipsListTableComponent,
    DatePickerComponent,
  ],
  providers: [basicShipDetailsFormProvider],
  templateUrl: './basic-ship-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicShipDetailsComponent {
  protected readonly formGroup = inject(TASK_FORM);
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RequestTaskStore);

  private readonly taskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  readonly isAer = computed(() => isAer(this.taskType()));
  readonly returnToLabel = computed(() => (this.isAer() ? emissionsSubtaskMap.ships.title : emissionsSubtaskMap.title));
  private get iceClassFormControl() {
    return this.formGroup.get('iceClass') as FormControl<ShipDetails['iceClass']>;
  }
  private readonly iceClassValue = toSignal(
    this.iceClassFormControl.valueChanges.pipe(startWith(this.iceClassFormControl.value)),
  );
  readonly showHasIceClassDerogation: Signal<boolean> = computed(() => {
    const shouldShow = shouldShowHasIceClassDerogation(this.iceClassValue());
    shouldShow
      ? this.formGroup.get('hasIceClassDerogation')?.enable()
      : this.formGroup.get('hasIceClassDerogation')?.disable();
    return shouldShow;
  });

  readonly typeSelectOptions = SHIP_TYPE_SELECT_ITEMS.sort((a, b) =>
    a.value === 'OTHER' ? 1 : a.text > b.text ? 1 : -1,
  );
  readonly iceClassesOptions = SHIP_ICE_CLASS_SELECT_ITEMS;
  readonly flagStateOptions = SHIP_FLAG_SELECT_ITEMS.sort((a, b) => (a.text > b.text ? 1 : -1));
  readonly map = emissionsShipSubtaskMap;

  onSubmit() {
    this.taskService
      .saveSubtask(EMISSIONS_SUB_TASK, BASIC_SHIP_DETAILS_STEP, this.route, this.formGroup.value)
      .subscribe();
  }
}
