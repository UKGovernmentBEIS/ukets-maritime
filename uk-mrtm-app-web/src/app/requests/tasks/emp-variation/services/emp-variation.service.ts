import { Injectable } from '@angular/core';

import { EmpVariationTaskPayload } from '@requests/common/emp';
import { empVariationQuery } from '@requests/common/emp/+state';
import { BaseEmpService } from '@requests/common/emp/services';

@Injectable()
export class EmpVariationService extends BaseEmpService<EmpVariationTaskPayload> {
  get payload(): EmpVariationTaskPayload {
    return this.store.select(empVariationQuery.selectPayload)();
  }

  set payload(payload: EmpVariationTaskPayload) {
    this.store.setPayload(payload);
  }
}
