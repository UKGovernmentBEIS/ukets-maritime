import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { TaskApiService, TaskService } from '@netz/common/forms';

import { AerVerificationSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { IThirdPartyDataProviderService } from '@requests/common/services';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { AerVerificationSubmitApiService } from '@requests/tasks/aer-verification-submit/services/aer-verification-submit-api.service';

@Injectable()
export class AerVerificationSubmitService
  extends TaskService<AerVerificationSubmitTaskPayload>
  implements IThirdPartyDataProviderService<AerVerificationSubmitTaskPayload>
{
  override apiService = inject(TaskApiService) as AerVerificationSubmitApiService;

  get payload(): AerVerificationSubmitTaskPayload {
    return this.store.select(aerVerificationSubmitQuery.selectPayload)();
  }

  set payload(payload: AerVerificationSubmitTaskPayload) {
    this.store.setPayload(payload);
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
