import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { virSubmitQuery } from '@requests/tasks/vir-submit/+state';
import { VirSubmitTaskPayload } from '@requests/tasks/vir-submit/vir-submit.types';

@Injectable()
export class VirSubmitService extends TaskService<VirSubmitTaskPayload> {
  get payload(): VirSubmitTaskPayload {
    return this.store.select(virSubmitQuery.selectPayload)();
  }
  set payload(payload: VirSubmitTaskPayload) {
    this.store.setPayload(payload);
  }
}
