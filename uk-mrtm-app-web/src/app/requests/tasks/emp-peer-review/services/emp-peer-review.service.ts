import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpPeerReviewTaskPayload } from '@requests/common/emp/emp.types';
import { BasePeerReviewService } from '@requests/common/services';

export class EmpPeerReviewService extends BasePeerReviewService<EmpPeerReviewTaskPayload> {
  get payload(): EmpPeerReviewTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpPeerReviewTaskPayload>())();
  }

  set payload(payload: EmpPeerReviewTaskPayload) {
    this.store.setPayload(payload);
  }
}
