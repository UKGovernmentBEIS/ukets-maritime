import { Injectable } from '@angular/core';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { BaseEmpService } from '@requests/common/emp/services';

@Injectable()
export class EmpService extends BaseEmpService<EmpTaskPayload> {
  get payload(): EmpTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpTaskPayload>())();
  }

  set payload(payload: EmpTaskPayload) {
    this.store.setPayload(payload);
  }
}
