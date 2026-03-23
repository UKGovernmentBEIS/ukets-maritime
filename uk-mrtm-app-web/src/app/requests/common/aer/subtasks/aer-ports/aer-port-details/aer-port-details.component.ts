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
import { LinkDirective, SelectComponent } from '@netz/govuk-components';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerPortDetailsFormProvider } from '@requests/common/aer/subtasks/aer-ports/aer-port-details/aer-port-details.form-provider';
import { AerPortDetailsFormGroupModel } from '@requests/common/aer/subtasks/aer-ports/aer-port-details/aer-port-details.types';
import { AER_PORTS_SUB_TASK, AerPortsWizardStep } from '@requests/common/aer/subtasks/aer-ports/aer-ports.helpers';
import { aerPortsMap } from '@requests/common/aer/subtasks/aer-ports/aer-ports-subtask-list.map';
import { TASK_FORM } from '@requests/common/task-form.token';
import { DatePickerComponent, DatePickerConfig } from '@shared/components';
import { TimeInputComponent } from '@shared/components/time-input';
import { WizardStepComponent } from '@shared/components/wizard/wizard-step.component';
import { AER_PORT_CODE_SELECT_ITEMS, AER_PORT_COUNTRY_SELECT_ITEMS } from '@shared/constants';

@Component({
  selector: 'mrtm-aer-port-details',
  standalone: true,
  imports: [
    WizardStepComponent,
    SelectComponent,
    ReactiveFormsModule,
    LinkDirective,
    RouterLink,
    TimeInputComponent,
    DatePickerComponent,
  ],
  providers: [aerPortDetailsFormProvider],
  templateUrl: './aer-port-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerPortDetailsComponent {
  protected readonly formGroup: FormGroup<AerPortDetailsFormGroupModel> = inject<FormGroup>(TASK_FORM);
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly taskService: TaskService<AerSubmitTaskPayload> = inject(TaskService<AerSubmitTaskPayload>);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  public readonly portId: InputSignal<string> = input<string>();

  public readonly wizardMap = aerPortsMap;
  public readonly countrySelectItems = AER_PORT_COUNTRY_SELECT_ITEMS.filter((x) => x.value === 'GB');
  private currentCountry = toSignal(this.countryCtrl.valueChanges.pipe(), { initialValue: this.countryCtrl.value });
  public portSelectItems = computed(() => {
    const country = this.currentCountry();
    return !country
      ? []
      : AER_PORT_CODE_SELECT_ITEMS.filter((item) => item.countryCode === country || item.value === 'NOT_APPLICABLE');
  });
  public readonly ship: Signal<AerShipEmissions> = computed(() => {
    const port = this.store.select(aerCommonQuery.selectPort(this.portId()))();

    return this.store.select(aerCommonQuery.selectShipByImoNumber(port?.imoNumber))();
  });

  constructor() {
    effect(() => {
      if (this.portSelectItems()?.length === 1) {
        this.formGroup.get('port').setValue('NOT_APPLICABLE', false);
      } else {
        this.formGroup.get('port').setValue(this.formGroup?.value?.port, false);
      }
    });
  }

  private get countryCtrl(): AbstractControl {
    return this.formGroup.get('country');
  }

  get datepickerConfig(): DatePickerConfig {
    const reportingYear = this.store.select(aerCommonQuery.selectReportingYear)();
    return {
      minDate: `01/01/${reportingYear}`,
      maxDate: `31/12/${reportingYear}`,
      weekStartDay: 'Monday',
      leadingZeros: false,
    };
  }

  onSubmit(): void {
    this.taskService
      .saveSubtask(AER_PORTS_SUB_TASK, AerPortsWizardStep.PORT_DETAILS, this.activatedRoute, this.formGroup.value)
      .pipe(take(1))
      .subscribe();
  }
}
