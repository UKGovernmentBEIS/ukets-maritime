import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { map, take } from 'rxjs';
import { isNil } from 'lodash-es';

import { AerFuelConsumption, AerShipEmissions } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { GovukSelectOption, LinkDirective, SelectComponent, TextInputComponent } from '@netz/govuk-components';

import {
  AER_FUEL_CONSUMPTION_STEP,
  AER_OBJECT_ROUTE_KEY,
  AER_RELATED_SHIP_SELECTOR,
  AER_SUBTASK,
  AER_SUBTASK_LIST_MAP,
} from '@requests/common/aer/aer.consts';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerFuelConsumptionFormProvider } from '@requests/common/aer/components/aer-fuel-consumption/aer-fuel-consumption.form-provider';
import {
  AerFuelConsumptionFormGroupModel,
  AerFuelConsumptionFormModel,
} from '@requests/common/aer/components/aer-fuel-consumption/aer-fuel-consumption.types';
import { TASK_FORM } from '@requests/common/task-form.token';
import { WizardStepComponent } from '@shared/components';
import { AER_PORT_MEASURING_UNIT_SELECT_ITEMS } from '@shared/constants';
import { FuelOriginTitlePipe } from '@shared/pipes';
import { AllFuels } from '@shared/types';
import { bigNumberUtils, isLNG } from '@shared/utils';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'mrtm-aer-fuel-consumption',
  standalone: true,
  imports: [WizardStepComponent, LinkDirective, RouterLink, SelectComponent, ReactiveFormsModule, TextInputComponent],
  providers: [aerFuelConsumptionFormProvider],
  templateUrl: './aer-fuel-consumption.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerFuelConsumptionComponent {
  private readonly subtask: string = inject(AER_SUBTASK);
  public readonly formGroup: FormGroup<AerFuelConsumptionFormGroupModel> = inject(TASK_FORM);
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly routeParamKey = inject(AER_OBJECT_ROUTE_KEY);
  private readonly relatedShipSelector = inject(AER_RELATED_SHIP_SELECTOR);
  public readonly wizardMap = inject(AER_SUBTASK_LIST_MAP);
  private readonly fuelOriginTitlePipe: FuelOriginTitlePipe = new FuelOriginTitlePipe();

  protected readonly isNil = isNil;
  public readonly measuringUnitSelectItems = AER_PORT_MEASURING_UNIT_SELECT_ITEMS;
  public readonly fuelConsumptionId: InputSignal<string> = input<string>();
  public readonly objectId: Signal<string> = toSignal(
    this.activatedRoute.params.pipe(map((param) => param?.[this.routeParamKey])),
  );
  ship: Signal<AerShipEmissions> = computed(() => this.store.select(this.relatedShipSelector(this.objectId()))());
  fuelTypeSelectItems: Signal<Array<GovukSelectOption<string>>> = computed(() => {
    const existingFuelDetailsUniqueIdentifiers = new Set<string>();

    return this.ship()
      ?.emissionsSources?.flatMap((emissionSource) =>
        emissionSource?.fuelDetails?.filter((fuelDetail) => {
          if (!existingFuelDetailsUniqueIdentifiers.has(fuelDetail.uniqueIdentifier)) {
            existingFuelDetailsUniqueIdentifiers.add(fuelDetail.uniqueIdentifier);
            return true;
          }
          return false;
        }),
      )
      .map((fuelOriginTypeName) => ({
        value: fuelOriginTypeName?.uniqueIdentifier,
        text: this.fuelOriginTitlePipe.transform(fuelOriginTypeName, false),
      }));
  });

  private readonly currentFuelOrigin: Signal<AerFuelConsumptionFormModel['fuelOrigin']> = toSignal(
    this.fuelOriginCtrl.valueChanges,
    {
      initialValue: this.fuelOriginCtrl.value,
    },
  );
  private readonly currentEmissionName: Signal<AerFuelConsumption['name']> = toSignal(
    this.emissionNameCtrl.valueChanges,
    {
      initialValue: this.emissionNameCtrl.value,
    },
  );
  private readonly currentMeasuringUnit: Signal<AerFuelConsumption['measuringUnit']> = toSignal(
    this.formGroup.get('measuringUnit').valueChanges,
    {
      initialValue: this.formGroup?.value?.measuringUnit,
    },
  );
  private readonly currentAmount: Signal<AerFuelConsumption['amount']> = toSignal(this.amountCtrl.valueChanges, {
    initialValue: this.amountCtrl.value,
  });
  private readonly currentDensity: Signal<AerFuelConsumption['fuelDensity']> = toSignal(
    this.fuelDensityCtrl.valueChanges,
    {
      initialValue: this.fuelDensityCtrl.value,
    },
  );

  emissionSourceSelectItems: Signal<GovukSelectOption<string>[]> = computed(() =>
    this.ship()
      ?.emissionsSources?.reduce((acc, emission) => {
        const filteredFuelDetails = emission.fuelDetails?.filter(
          (fuelDetail) => fuelDetail.uniqueIdentifier === this.currentFuelOrigin(),
        );

        if (filteredFuelDetails && filteredFuelDetails.length > 0) {
          acc.push({ ...emission, fuelDetails: filteredFuelDetails });
        }

        return acc;
      }, [])
      .map((emission) => ({
        value: emission.name,
        text: emission.name,
      })),
  );

  methaneSlipSelectItems: Signal<Array<GovukSelectOption>> = computed(() => {
    const filteredEmissionSources = this.ship()?.emissionsSources?.reduce((acc, emission) => {
      const filteredFuelDetails = emission.fuelDetails?.filter(
        (fuelDetail) => fuelDetail.uniqueIdentifier === this.currentFuelOrigin(),
      );

      if (filteredFuelDetails && filteredFuelDetails.length > 0) {
        acc.push({ ...emission, fuelDetails: filteredFuelDetails });
      }

      return acc;
    }, []);

    const selectedEmission = this.currentEmissionName();

    const methaneSlipList = filteredEmissionSources.flatMap((emission) =>
      emission?.fuelDetails
        .filter((item) => item?.methaneSlip)
        .map((item) => ({
          name: emission.name,
          methaneSlip: item.methaneSlip,
          methaneSlipValueType: item.methaneSlipValueType,
        })),
    );

    return [
      ...new Set(
        (methaneSlipList ?? []).filter((methaneSlipItem) =>
          selectedEmission ? methaneSlipItem.name.trim() === selectedEmission.trim() : true,
        ),
      ),
    ]
      .map((emission) => ({
        value: emission.methaneSlip,
        text: emission.methaneSlip,
      }))
      .sort((a, b) => (a.value > b.value ? 1 : -1));
  });

  constructor() {
    effect(() => {
      const unit = this.currentMeasuringUnit();

      if (unit === 'M3') {
        this.fuelDensityCtrl.enable();
      } else {
        this.fuelDensityCtrl.setValue(null);
        this.fuelDensityCtrl.disable();
      }
    });

    effect(() => {
      const amount = this.currentAmount() ?? 0;
      const density = this.currentDensity();
      if (!this.amountCtrl.valid || (this.currentMeasuringUnit() === 'M3' && !this.fuelDensityCtrl.valid)) {
        this.formGroup.get('totalConsumption').setValue(null);
        return;
      }

      this.formGroup
        .get('totalConsumption')
        .setValue(
          bigNumberUtils.isInputBigNumberEmpty(density)
            ? amount
            : new BigNumber(amount).multipliedBy(new BigNumber(density)).decimalPlaces(5, BigNumber.ROUND_HALF_UP),
        );
    });
  }

  private get fuelOriginCtrl(): AbstractControl {
    return this.formGroup.get('fuelOrigin');
  }

  private get emissionNameCtrl(): AbstractControl {
    return this.formGroup.get('name');
  }

  private get methaneSlipCtrl(): AbstractControl {
    return this.formGroup.get('methaneSlip');
  }

  private get fuelDensityCtrl(): AbstractControl {
    return this.formGroup.get('fuelDensity');
  }

  private get amountCtrl(): AbstractControl {
    return this.formGroup.get('amount');
  }

  onChangeFuelOrigin() {
    this.emissionNameCtrl.setValue(null);
    this.methaneSlipCtrl.setValue(null);
    if (!this.isLNGType()) {
      this.methaneSlipCtrl.disable();
    } else {
      this.methaneSlipCtrl.enable();
    }
    this.formGroup.updateValueAndValidity();
  }

  onChangeEmissionName() {
    this.methaneSlipCtrl.setValue(null);
    this.formGroup.updateValueAndValidity();
  }

  isLNGType() {
    const fuelDetailsUniqueId: string = this.fuelOriginCtrl?.value;
    const currentFuelFactor = this.ship()?.fuelsAndEmissionsFactors.find(
      (item) => item.uniqueIdentifier === fuelDetailsUniqueId,
    ) as AllFuels;
    return isLNG(currentFuelFactor);
  }

  onSubmit(): void {
    this.service
      .saveSubtask(this.subtask, AER_FUEL_CONSUMPTION_STEP, this.activatedRoute, this.formGroup.getRawValue())
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(this.fuelConsumptionId() ? ['../../'] : ['../'], { relativeTo: this.activatedRoute });
      });
  }
}
