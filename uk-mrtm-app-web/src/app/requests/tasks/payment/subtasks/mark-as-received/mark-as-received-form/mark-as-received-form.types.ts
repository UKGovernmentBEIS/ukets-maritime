import { FormControl, FormGroup } from '@angular/forms';

import { PaymentMarkAsReceivedRequestTaskActionPayload } from '@mrtm/api';

export type MarkAsReceivedFormModel = Pick<PaymentMarkAsReceivedRequestTaskActionPayload, 'receivedDate'>;
export type MarkAsReceivedFormGroupModel = FormGroup<Record<keyof MarkAsReceivedFormModel, FormControl>>;
