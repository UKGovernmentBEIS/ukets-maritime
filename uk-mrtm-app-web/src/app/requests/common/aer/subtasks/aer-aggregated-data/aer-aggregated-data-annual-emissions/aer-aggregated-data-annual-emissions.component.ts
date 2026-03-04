import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  OnInit,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { AerPortEmissionsMeasurement } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerAggregatedEmissionsFormComponent, fieldValidators } from '@requests/common/aer/components';
import {
  AER_AGGREGATED_DATA_SUB_TASK,
  AerAggregatedDataWizardStep,
} from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data.helpers';
import { aerAggregatedDataAnnualEmissionsFormProvider } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-annual-emissions/aer-aggregated-data-annual-emissions.form-provider';
import { AerAggregatedDataAnnualEmissionsFormModel } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-annual-emissions/aer-aggregated-data-annual-emissions.types';
import { AerAggregatedDataAnnualEmissionsTotalsComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-annual-emissions/aer-aggregated-data-annual-emissions-totals';
import { aerAggregatedDataSubtasksListMap } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-subtasks-list.map';
import { calculateTotalEmissionsFromVoyagesAndPortsMeasurement } from '@requests/common/aer/subtasks/utils';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { isNil } from '@shared/utils';

@Component({
  selector: 'mrtm-aer-aggregated-data-annual-emissions',
  imports: [
    WizardStepComponent,
    RouterLink,
    LinkDirective,
    AerAggregatedEmissionsFormComponent,
    ReactiveFormsModule,
    AerAggregatedDataAnnualEmissionsTotalsComponent,
  ],
  standalone: true,
  templateUrl: './aer-aggregated-data-annual-emissions.component.html',
  providers: [aerAggregatedDataAnnualEmissionsFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerAggregatedDataAnnualEmissionsComponent implements OnInit {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  public readonly form = inject(TASK_FORM);
  public readonly wizardMap = aerAggregatedDataSubtasksListMap;
  public readonly dataId: InputSignal<string> = input<string>();
  public readonly ship = computed(() =>
    this.store.select(aerCommonQuery.selectRelatedShipForAggregatedData(this.dataId()))(),
  );

  public readonly currentValues: Signal<Partial<AerAggregatedDataAnnualEmissionsFormModel>> = toSignal(
    this.form.valueChanges,
    { initialValue: this.form.value },
  );

  constructor() {
    effect(() => {
      const { emissionsBetweenUKPorts, emissionsWithinUKPorts, emissionsBetweenUKAndNIVoyages } = this.currentValues();

      const total = calculateTotalEmissionsFromVoyagesAndPortsMeasurement(
        emissionsBetweenUKPorts,
        emissionsWithinUKPorts,
        emissionsBetweenUKAndNIVoyages,
      );

      this.form.get('totalEmissionsFromVoyagesAndPorts').setValue(total, { emitEvent: false });
    });
  }

  public async onSubmit(): Promise<void> {
    this.service
      .saveSubtask(
        AER_AGGREGATED_DATA_SUB_TASK,
        AerAggregatedDataWizardStep.ANNUAL_EMISSIONS,
        this.activatedRoute,
        this.form.value,
      )
      .pipe(take(1))
      .subscribe();
  }

  ngOnInit(): void {
    for (const key of ['emissionsBetweenUKPorts', 'emissionsWithinUKPorts', 'emissionsBetweenUKAndNIVoyages']) {
      this.onCalculationValueChanged(key as keyof AerAggregatedDataAnnualEmissionsFormModel);
    }
  }

  public onCalculationValueChanged(groupFieldKey: keyof AerAggregatedDataAnnualEmissionsFormModel): void {
    const trackedFormGroup = this.form.get(groupFieldKey);
    const groupValue: Partial<AerPortEmissionsMeasurement> = trackedFormGroup?.value;
    const groupControlKeys: Array<keyof AerPortEmissionsMeasurement> = ['co2', 'n2o', 'ch4'];
    const isEmptyGroup = Object.values(groupValue ?? {}).every((value) => isNil(value) || `${value}`.trim() === '');

    for (const formKey of groupControlKeys) {
      const control = trackedFormGroup?.get(formKey);

      if (isEmptyGroup) {
        control.clearValidators();
      } else {
        control.setValidators(fieldValidators);
      }

      control.updateValueAndValidity({ emitEvent: true });
    }

    this.form.updateValueAndValidity({ emitEvent: true });
  }
}
