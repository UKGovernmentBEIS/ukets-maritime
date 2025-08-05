import { Injectable } from '@angular/core';

import { concatMap, map, Observable, tap } from 'rxjs';

import { EmpAmendTaskPayload, empCommonQuery, EmpVariationTaskPayload } from '@requests/common/emp';
import { BaseEmpService } from '@requests/common/emp/services';

@Injectable()
export class EmpAmendService extends BaseEmpService<EmpAmendTaskPayload> {
  get payload(): EmpVariationTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpAmendTaskPayload>())();
  }

  set payload(payload: EmpAmendTaskPayload) {
    this.store.setPayload(payload);
  }

  public saveChangesAgreement(subtask: string, step: string, userInput: any): Observable<EmpAmendTaskPayload> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.apiService.save(payload)),
      tap((payload: EmpAmendTaskPayload) => (this.payload = payload)),
      map(() => this.payload),
    );
  }
}
