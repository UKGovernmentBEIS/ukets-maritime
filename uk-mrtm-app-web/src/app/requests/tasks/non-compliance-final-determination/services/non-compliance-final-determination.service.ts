import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { NonComplianceFinalDeterminationTaskPayload } from '@requests/common/non-compliance';
import { nonComplianceFinalDeterminationQuery } from '@requests/tasks/non-compliance-final-determination/+state';

@Injectable()
export class NonComplianceFinalDeterminationService extends TaskService<NonComplianceFinalDeterminationTaskPayload> {
  get payload(): NonComplianceFinalDeterminationTaskPayload {
    return this.store.select(nonComplianceFinalDeterminationQuery.selectPayload)();
  }

  set payload(payload: NonComplianceFinalDeterminationTaskPayload) {
    this.store.setPayload(payload);
  }
}
