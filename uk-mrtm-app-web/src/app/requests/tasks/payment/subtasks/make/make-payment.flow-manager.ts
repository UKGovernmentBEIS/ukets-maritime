import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { paymentQuery } from '@requests/tasks/payment/+state';
import {
  MAKE_PAYMENT_SUBTASK,
  MakePaymentWizardSteps,
} from '@requests/tasks/payment/subtasks/make/make-payment.constants';

export class MakePaymentFlowManager extends WizardFlowManager {
  public readonly subtask: string = MAKE_PAYMENT_SUBTASK;

  nextStepPath(currentStep: string): Observable<string> {
    const paymentMethod = this.store.select(paymentQuery.selectPaymentMethod)();
    const redirectUrl = this.store.select(paymentQuery.selectRedirectUrl)();
    const pendingPaymentExist = this.store.select(paymentQuery.selectPendingPaymentExist)();

    switch (currentStep) {
      case MakePaymentWizardSteps.PAYMENT_METHOD:
        if (paymentMethod === 'BANK_TRANSFER') {
          return of(`../${MakePaymentWizardSteps.BANK_TRANSFER}`);
        }

        if (pendingPaymentExist) {
          return of(`../${MakePaymentWizardSteps.CONFIRMATION}`);
        }

        window.location.assign(redirectUrl);
        return of('.');
      case MakePaymentWizardSteps.BANK_TRANSFER:
        return of(MakePaymentWizardSteps.BANK_TRANSFER_SUBMIT);
      default:
        return of('../../');
    }
  }
}
