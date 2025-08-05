import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload } from '@mrtm/api';

import { empCommonQuery, EmpReviewTaskPayload } from '@requests/common';
import { IReturnForAmendsService } from '@requests/common/emp/return-for-amends';
import { BaseEmpService } from '@requests/common/emp/services';
import { EmpReviewApiService } from '@requests/tasks/emp-review/services/emp-review-api.service';

@Injectable()
export class EmpReviewService
  extends BaseEmpService<EmpReviewTaskPayload>
  implements IReturnForAmendsService<EmpReviewTaskPayload>
{
  get payload(): EmpReviewTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpReviewTaskPayload>())();
  }

  set payload(payload: EmpReviewTaskPayload) {
    this.store.setPayload(payload);
  }

  saveReviewDecision(
    subtask: string,
    step: string,
    route: ActivatedRoute,
    userInput: any,
    reviewGroup: EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload['reviewGroup'],
  ): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) => (this.apiService as EmpReviewApiService).saveReviewDecision(payload as any, reviewGroup)),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }

  saveReviewDetermination(subtask: string, step: string, route: ActivatedRoute, userInput: any): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) => (this.apiService as EmpReviewApiService).saveReviewDetermination(payload)),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }

  sendForAmends(): Observable<EmpReviewTaskPayload> {
    return (this.apiService as EmpReviewApiService).sendForAmends(this.payload);
  }
}
