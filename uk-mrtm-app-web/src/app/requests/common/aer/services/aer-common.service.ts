import { Injectable } from '@angular/core';

import { Observable, tap } from 'rxjs';

import { TaskService } from '@netz/common/forms';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerCommonApiService } from '@requests/common/aer/services/aer-common-api.service';

@Injectable()
export class AerCommonService extends TaskService<AerSubmitTaskPayload> {
  get payload(): AerSubmitTaskPayload {
    return this.store.select(aerCommonQuery.selectPayload)();
  }

  set payload(payload: AerSubmitTaskPayload) {
    this.store.setPayload(payload);
  }

  fetchShipsFromEMP(): Observable<any> {
    return (this.apiService as AerCommonApiService)
      .fetchShipsFromEMP()
      .pipe(tap((payload) => (this.payload = payload)));
  }

  submitForVerification(): Observable<any> {
    return (this.apiService as AerCommonApiService).submitForVerification();
  }
}
