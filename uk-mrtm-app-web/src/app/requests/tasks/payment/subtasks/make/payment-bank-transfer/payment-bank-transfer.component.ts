import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { take } from 'rxjs';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective, DetailsComponent, WarningTextComponent } from '@netz/govuk-components';

import { paymentQuery } from '@requests/tasks/payment/+state';
import {
  MAKE_PAYMENT_SUBTASK,
  MakePaymentWizardSteps,
} from '@requests/tasks/payment/subtasks/make/make-payment.constants';
import {
  InternationalPaymentDetailsSummaryTemplateComponent,
  PaymentBankTransferSummaryTemplateComponent,
} from '@shared/components';

@Component({
  selector: 'mrtm-payment-bank-transfer',
  imports: [
    ButtonDirective,
    PageHeadingComponent,
    WarningTextComponent,
    DetailsComponent,
    PaymentBankTransferSummaryTemplateComponent,
    InternationalPaymentDetailsSummaryTemplateComponent,
    ReturnToTaskOrActionPageComponent,
  ],
  standalone: true,
  templateUrl: './payment-bank-transfer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentBankTransferComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly paymentDetails = this.store.select(paymentQuery.selectPayload);

  public onSubmit(): void {
    this.service
      .saveSubtask(MAKE_PAYMENT_SUBTASK, MakePaymentWizardSteps.BANK_TRANSFER, this.activatedRoute, undefined)
      .pipe(take(1))
      .subscribe();
  }
}
