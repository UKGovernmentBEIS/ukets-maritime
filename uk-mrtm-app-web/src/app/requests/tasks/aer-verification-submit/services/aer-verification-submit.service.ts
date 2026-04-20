import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';

@Injectable()
export class AerVerificationSubmitService extends TaskService<AerVerificationSubmitTaskPayload> {
  get payload(): AerVerificationSubmitTaskPayload {
    return this.store.select(aerVerificationSubmitQuery.selectPayload)();
  }

  set payload(payload: AerVerificationSubmitTaskPayload) {
    this.store.setPayload(payload);
  }
}
