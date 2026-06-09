import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { TaskApiService } from '@netz/common/forms';

import { EmpVariationTaskPayload } from '@requests/common/emp';
import { empVariationQuery } from '@requests/common/emp/+state';
import { BaseEmpService } from '@requests/common/emp/services';
import { IThirdPartyDataProviderService } from '@requests/common/services';
import { EmpVariationApiService } from '@requests/tasks/emp-variation/services/emp-variation-api.service';

@Injectable()
export class EmpVariationService
  extends BaseEmpService<EmpVariationTaskPayload>
  implements IThirdPartyDataProviderService<EmpVariationTaskPayload>
{
  override apiService = inject(TaskApiService) as EmpVariationApiService;

  get payload(): EmpVariationTaskPayload {
    return this.store.select(empVariationQuery.selectPayload)();
  }

  set payload(payload: EmpVariationTaskPayload) {
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
