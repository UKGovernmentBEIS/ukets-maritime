import { FormControl, FormGroup } from '@angular/forms';

import { PaymentCancelRequestTaskActionPayload } from '@mrtm/api';

export type CancelPaymentFormModel = Pick<PaymentCancelRequestTaskActionPayload, 'reason'>;
export type CancelPaymentFormGroupModel = FormGroup<Record<keyof CancelPaymentFormModel, FormControl>>;
