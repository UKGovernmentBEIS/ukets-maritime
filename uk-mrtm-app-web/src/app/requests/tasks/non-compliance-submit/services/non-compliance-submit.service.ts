import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { NonComplianceSubmitTaskPayload } from '@requests/common/non-compliance';
import { nonComplianceSubmitQuery } from '@requests/tasks/non-compliance-submit/+state';

@Injectable()
export class NonComplianceSubmitService extends TaskService<NonComplianceSubmitTaskPayload> {
  get payload(): NonComplianceSubmitTaskPayload {
    return this.store.select(nonComplianceSubmitQuery.selectPayload)();
  }

  set payload(payload: NonComplianceSubmitTaskPayload) {
    this.store.setPayload(payload);
  }
}
