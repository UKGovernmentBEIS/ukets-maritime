import { Injectable } from '@angular/core';

import { NonComplianceCivilPenaltyRequestTaskPayload } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { nonComplianceCivilPenaltyCommonQuery } from '@requests/common/non-compliance/non-compliance-civil-penalty/+state';

@Injectable()
export class NonComplianceCivilPenaltyService extends TaskService<NonComplianceCivilPenaltyRequestTaskPayload> {
  get payload(): NonComplianceCivilPenaltyRequestTaskPayload {
    return this.store.select(nonComplianceCivilPenaltyCommonQuery.selectPayload)();
  }

  set payload(payload: NonComplianceCivilPenaltyRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
