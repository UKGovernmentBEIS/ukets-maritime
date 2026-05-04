import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { take } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { TextareaComponent } from '@netz/govuk-components';

import { TASK_FORM } from '@requests/common';
import { PaymentService } from '@requests/tasks/payment/services';
import { CancelPaymentWizardSteps } from '@requests/tasks/payment/subtasks/cancel';
import { cancelPaymentFormProvider } from '@requests/tasks/payment/subtasks/cancel/cancel-payment-form/cancel-payment-form.provider';
import { WizardStepComponent } from '@shared/components';

@Component({
  selector: 'mrtm-cancel-payment-form',
  imports: [WizardStepComponent, TextareaComponent, ReactiveFormsModule],
  standalone: true,
  templateUrl: './cancel-payment-form.component.html',
  providers: [cancelPaymentFormProvider],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelPaymentFormComponent {
  private readonly service = inject(TaskService) as PaymentService;
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly form = inject<FormGroup>(TASK_FORM);

  public onSubmit(): void {
    this.service
      .cancelPayment(this.form.value)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate([CancelPaymentWizardSteps.SUCCESS], { relativeTo: this.activatedRoute });
      });
  }
}
