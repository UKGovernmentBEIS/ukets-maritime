import { empCommonQuery, EmpVariationRegulatorPeerReviewTaskPayload } from '@requests/common';
import { BasePeerReviewService } from '@requests/common/services';

export class EmpVariationRegulatorPeerReviewService extends BasePeerReviewService<EmpVariationRegulatorPeerReviewTaskPayload> {
  get payload(): EmpVariationRegulatorPeerReviewTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpVariationRegulatorPeerReviewTaskPayload>())();
  }

  set payload(payload: EmpVariationRegulatorPeerReviewTaskPayload) {
    this.store.setPayload(payload);
  }
}
