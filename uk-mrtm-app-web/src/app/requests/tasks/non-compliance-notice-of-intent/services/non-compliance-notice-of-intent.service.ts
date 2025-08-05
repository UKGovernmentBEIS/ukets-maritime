import { Injectable } from '@angular/core';

import { NonComplianceNoticeOfIntentRequestTaskPayload } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { nonComplianceNoticeOfIntentCommonQuery } from '@requests/common/non-compliance/non-compliance-notice-of-intent/+state';

@Injectable()
export class NonComplianceNoticeOfIntentService extends TaskService<NonComplianceNoticeOfIntentRequestTaskPayload> {
  get payload(): NonComplianceNoticeOfIntentRequestTaskPayload {
    return this.store.select(nonComplianceNoticeOfIntentCommonQuery.selectPayload)();
  }

  set payload(payload: NonComplianceNoticeOfIntentRequestTaskPayload) {
    this.store.setPayload(payload);
  }
}
