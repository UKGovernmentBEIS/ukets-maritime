import { TaskService } from '@netz/common/forms';

import { VirReviewTaskPayload } from '@requests/tasks/vir-review/vir-review.types';
import { virSubmitQuery } from '@requests/tasks/vir-submit/+state';

export class VirReviewService extends TaskService<VirReviewTaskPayload> {
  get payload(): VirReviewTaskPayload {
    return this.store.select(virSubmitQuery.selectPayload)();
  }
  set payload(payload: VirReviewTaskPayload) {
    this.store.setPayload(payload);
  }
}
