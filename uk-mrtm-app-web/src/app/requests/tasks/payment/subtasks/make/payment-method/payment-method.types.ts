import { FormControl, FormGroup } from '@angular/forms';

import { PaymentTaskPayload } from '@requests/tasks/payment/payment.types';

export type PaymentMethodFormModel = Pick<PaymentTaskPayload, 'paymentMethod'>;
export type PaymentMethodFormGroupModel = FormGroup<Record<keyof PaymentMethodFormModel, FormControl>>;
