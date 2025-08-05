import { Observable, of } from 'rxjs';
import { produce } from 'immer';

import { PayloadMutator } from '@netz/common/forms';

import { PaymentTaskPayload } from '@requests/tasks/payment/payment.types';
import {
  MAKE_PAYMENT_SUBTASK,
  MakePaymentWizardSteps,
} from '@requests/tasks/payment/subtasks/make/make-payment.constants';
import { PaymentMethodFormModel } from '@requests/tasks/payment/subtasks/make/payment-method/payment-method.types';

export class PaymentMethodPayloadMutator extends PayloadMutator {
  public readonly subtask: string = MAKE_PAYMENT_SUBTASK;
  public readonly step: string = MakePaymentWizardSteps.PAYMENT_METHOD;

  public apply(currentPayload: PaymentTaskPayload, userInput: PaymentMethodFormModel): Observable<PaymentTaskPayload> {
    return of(
      produce(currentPayload, (payload: PaymentTaskPayload) => {
        payload.paymentMethod = userInput.paymentMethod;
      }),
    );
  }
}
