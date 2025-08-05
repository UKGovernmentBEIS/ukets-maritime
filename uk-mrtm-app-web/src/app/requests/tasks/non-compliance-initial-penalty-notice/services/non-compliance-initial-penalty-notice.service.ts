import { Injectable } from '@angular/core';

import { NonComplianceInitialPenaltyNoticeRequestTaskPayload } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { nonComplianceInitialPenaltyNoticeCommonQuery } from '@requests/common/non-compliance/non-compliance-initial-penalty-notice/+state';

@Injectable()
export class NonComplianceInitialPenaltyNoticeService extends TaskService<NonComplianceInitialPenaltyNoticeRequestTaskPayload> {
  get payload(): NonComplianceInitialPenaltyNoticeRequestTaskPayload {
    return this.store.select(nonComplianceInitialPenaltyNoticeCommonQuery.selectPayload)();
  }

  set payload(payload: NonComplianceInitialPenaltyNoticeRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
