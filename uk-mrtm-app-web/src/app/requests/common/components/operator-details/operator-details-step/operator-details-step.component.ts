import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';
import { isNil } from 'lodash-es';

import { MaritimeAccountsService } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { TextInputComponent } from '@netz/govuk-components';

import {
  OPERATOR_DETAILS_SUB_TASK,
  operatorDetailsMap,
  OperatorDetailsWizardStep,
} from '@requests/common/components/operator-details';
import { operatorDetailsStepFormProvider } from '@requests/common/components/operator-details/operator-details-step/operator-details-step.form-provider';
import { TASK_FORM } from '@requests/common/task-form.token';
import { LocationStateFormComponent, WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-operator-details-step',
  imports: [WizardStepComponent, TextInputComponent, ReactiveFormsModule, LocationStateFormComponent],
  standalone: true,
  templateUrl: './operator-details-step.component.html',
  providers: [operatorDetailsStepFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsStepComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService);
  private readonly accountService = inject(MaritimeAccountsService);

  readonly formGroup = inject<FormGroup>(TASK_FORM);
  readonly accountId = this.store.select(requestTaskQuery.selectRequestTaskAccountId)();
  readonly operatorDetailsMap = operatorDetailsMap;
  readonly existImoNumber = toSignal<boolean>(this.imoNumberCtrl.valueChanges, {
    initialValue: this.imoNumberCtrl.value,
  });

  constructor() {
    effect(() => {
      if (!isNil(this.existImoNumber())) {
        return;
      }
      this.accountService
        .getMaritimeAccount(this.accountId)
        .pipe(take(1))
        .subscribe(({ account }) => {
          const { imoNumber, name, line2, line1, city, country, postcode, state } = account;
          this.formGroup.patchValue({
            imoNumber,
            operatorName: name,
            contactAddress: {
              line1,
              line2: line2 || null,
              city,
              country,
              postcode: postcode || null,
              state: state || null,
            },
          });
          this.formGroup.updateValueAndValidity({ emitEvent: true });
        });
    });
  }

  get imoNumberCtrl(): UntypedFormControl {
    return this.formGroup.get('imoNumber') as UntypedFormControl;
  }

  onSubmit() {
    this.service
      .saveSubtask(OPERATOR_DETAILS_SUB_TASK, OperatorDetailsWizardStep.OPERATOR_DETAILS_OPERATOR_FORM, this.route, {
        ...this.formGroup.value,
        imoNumber: this.imoNumberCtrl.value,
      })
      .subscribe();
  }
}
