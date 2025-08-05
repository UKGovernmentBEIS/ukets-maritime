import { Injectable } from '@angular/core';

import { empCommonQuery, EmpVariationAmendTaskPayload } from '@requests/common/emp';
import { BaseEmpService } from '@requests/common/emp/services';

@Injectable()
export class EmpAmendVariationService extends BaseEmpService<EmpVariationAmendTaskPayload> {
  get payload(): EmpVariationAmendTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpVariationAmendTaskPayload>())();
  }

  set payload(payload: EmpVariationAmendTaskPayload) {
    this.store.setPayload(payload);
  }
}
