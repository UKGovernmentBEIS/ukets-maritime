import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { TaskApiService } from '@netz/common/forms';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpTaskPayload } from '@requests/common/emp/emp.types';
import { BaseEmpService } from '@requests/common/emp/services';
import { IThirdPartyDataProviderService } from '@requests/common/services';
import { EmpApiService } from '@requests/tasks/emp-submit/services/emp-api.service';

@Injectable()
export class EmpService
  extends BaseEmpService<EmpTaskPayload>
  implements IThirdPartyDataProviderService<EmpTaskPayload>
{
  override apiService = inject(TaskApiService) as EmpApiService;

  get payload(): EmpTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpTaskPayload>())();
  }

  set payload(payload: EmpTaskPayload) {
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
