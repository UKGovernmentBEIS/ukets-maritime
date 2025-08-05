import { Observable } from 'rxjs';

import { requestTaskQuery } from '@netz/common/store';

import { AerCommonApiService } from '@requests/common/aer/services';

export class AerAmendApiService extends AerCommonApiService {
  submitForVerification(): Observable<void> {
    return this.handleSubmit({
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'AER_REQUEST_AMENDS_VERIFICATION',
      requestTaskActionPayload: { payloadType: 'EMPTY_PAYLOAD' },
    });
  }
}
