import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload } from '@mrtm/api';

import { empCommonQuery, EmpVariationRegulatorTaskPayload } from '@requests/common/emp';
import { BaseEmpService } from '@requests/common/emp/services';
import { EmpVariationRegulatorApiService } from '@requests/tasks/emp-variation-regulator/services';

@Injectable()
export class EmpVariationRegulatorService extends BaseEmpService<EmpVariationRegulatorTaskPayload> {
  get payload(): EmpVariationRegulatorTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpVariationRegulatorTaskPayload>())();
  }

  set payload(payload: EmpVariationRegulatorTaskPayload) {
    this.store.setPayload(payload);
  }

  saveVariationRegulatorDecision(
    subtask: string,
    step: string,
    route: ActivatedRoute,
    userInput: any,
    group: EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload['group'],
  ): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) =>
        (this.apiService as EmpVariationRegulatorApiService).saveVariationRegulatorDecision(payload as any, group),
      ),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }
}
