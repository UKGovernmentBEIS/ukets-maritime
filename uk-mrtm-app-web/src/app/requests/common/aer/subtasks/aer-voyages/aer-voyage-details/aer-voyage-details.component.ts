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
import { ActivatedRoute, RouterLink } from '@angular/router';

import { take } from 'rxjs';

import { AerShipEmissions } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import {
  DateInputComponent,
  LinkDirective,
  RadioComponent,
  RadioOptionComponent,
  SelectComponent,
  TextInputComponent,
} from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVoyageDetailsFormProvider } from '@requests/common/aer/subtasks/aer-voyages/aer-voyage-details/aer-voyage-details.form-provider';
import {
  AER_VOYAGES_SUB_TASK,
  AerVoyagesWizardStep,
} from '@requests/common/aer/subtasks/aer-voyages/aer-voyages.helpers';
import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages/aer-voyages-subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { TimeInputComponent, WizardStepComponent } from '@shared/components';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';

@Component({
  selector: 'mrtm-aer-voyage-details',
  standalone: true,
  imports: [
    WizardStepComponent,
    ReactiveFormsModule,
    SelectComponent,
    DateInputComponent,
    TimeInputComponent,
    TextInputComponent,
    RadioOptionComponent,
    RadioComponent,
    RouterLink,
    LinkDirective,
  ],
  providers: [aerVoyageDetailsFormProvider],
  templateUrl: './aer-voyage-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVoyageDetailsComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly taskService: TaskService<AerSubmitTaskPayload> = inject(TaskService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly form: FormGroup = inject(TASK_FORM);
  public readonly wizardMap = aerVoyagesMap;
  public readonly voyageId: InputSignal<string> = input<string>();
  public readonly countrySelectItems = AER_PORT_COUNTRY_SELECT_ITEMS;

  private get arrivalCountryCtrl(): AbstractControl {
    return this.form.get('arrivalCountry');
  }
  private get departureCountryCtrl(): AbstractControl {
    return this.form.get('departureCountry');
  }
  private currentArrivalCountry = toSignal(this.arrivalCountryCtrl.valueChanges.pipe(), {
    initialValue: this.arrivalCountryCtrl.value,
  });
  private departureArrivalCountry = toSignal(this.departureCountryCtrl.valueChanges.pipe(), {
    initialValue: this.departureCountryCtrl.value,
  });

  public readonly ship: Signal<AerShipEmissions> = computed(() => {
    const port = this.store.select(aerCommonQuery.selectVoyage(this.voyageId()))();

    return this.store.select(aerCommonQuery.selectShipByImoNumber(port?.imoNumber))();
  });

  public portArrivalSelectItems = computed(() => {
    const country = this.currentArrivalCountry();
    return !country
      ? []
      : AER_PORT_CODE_SELECT_ITEMS.filter((item) => item.countryCode === country || item.value === 'NOT_APPLICABLE');
  });

  public portDepartureSelectItems = computed(() => {
    const country = this.departureArrivalCountry();
    return !country
      ? []
      : AER_PORT_CODE_SELECT_ITEMS.filter((item) => item.countryCode === country || item.value === 'NOT_APPLICABLE');
  });

  public constructor() {
    effect(() => {
      const arrivalPortValue =
        this.portArrivalSelectItems()?.length === 1 ? 'NOT_APPLICABLE' : this.form?.value?.arrivalPort;

      const departurePortValue =
        this.portDepartureSelectItems()?.length === 1 ? 'NOT_APPLICABLE' : this.form?.value?.departurePort;

      this.form.get('arrivalPort').setValue(arrivalPortValue, false);
      this.form.get('departurePort').setValue(departurePortValue, false);
    });
  }

  public onSubmit(): void {
    this.taskService
      .saveSubtask(AER_VOYAGES_SUB_TASK, AerVoyagesWizardStep.VOYAGE_DETAILS, this.activatedRoute, this.form.value)
      .pipe(take(1))
      .subscribe();
  }
}
