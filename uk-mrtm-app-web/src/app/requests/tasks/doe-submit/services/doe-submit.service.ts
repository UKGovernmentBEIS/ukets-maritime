import { Injectable } from '@angular/core';

import { TaskService } from '@netz/common/forms';

import { doeCommonQuery } from '@requests/common/doe';
import { DoeTaskPayload } from '@requests/tasks/doe-submit/doe-submit.types';

@Injectable()
export class DoeSubmitService extends TaskService<DoeTaskPayload> {
  get payload(): DoeTaskPayload {
    return this.store.select(doeCommonQuery.selectPayload)();
  }

  set payload(payload: DoeTaskPayload) {
    this.store.setPayload(payload);
  }
}
