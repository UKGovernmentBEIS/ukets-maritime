import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { TaskApiService, TaskService } from '@netz/common/forms';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerCommonApiService } from '@requests/common/aer/services/aer-common-api.service';
import { IThirdPartyDataProviderService } from '@requests/common/services';

@Injectable()
export class AerCommonService
  extends TaskService<AerSubmitTaskPayload>
  implements IThirdPartyDataProviderService<AerSubmitTaskPayload>
{
  override apiService = inject(TaskApiService) as AerCommonApiService;

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

  importThirdPartyData<TInput = any>(
    subtask: string,
    step: string,
    route: ActivatedRoute,
    userInput: TInput,
  ): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) => this.apiService.importThirdPartyData(payload)),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }
}
