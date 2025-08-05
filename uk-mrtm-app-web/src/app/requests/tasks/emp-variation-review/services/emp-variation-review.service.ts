import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import {
  EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload,
  EmpVariationApplicationReviewRequestTaskPayload,
} from '@mrtm/api';

import { empCommonQuery } from '@requests/common/emp/+state';
import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { IReturnForAmendsService } from '@requests/common/emp/return-for-amends';
import { BaseEmpService } from '@requests/common/emp/services';
import { EmpVariationReviewApiService } from '@requests/tasks/emp-variation-review/services';

@Injectable()
export class EmpVariationReviewService
  extends BaseEmpService<EmpVariationReviewTaskPayload>
  implements IReturnForAmendsService<EmpVariationReviewTaskPayload>
{
  get payload(): EmpVariationReviewTaskPayload {
    return this.store.select(empCommonQuery.selectPayload<EmpVariationReviewTaskPayload>())();
  }

  set payload(payload: EmpVariationReviewTaskPayload) {
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
      concatMap((payload) =>
        (this.apiService as EmpVariationReviewApiService).saveReviewDecision(payload as any, reviewGroup),
      ),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }

  saveVariationDetailsReviewDecision(
    subtask: string,
    step: string,
    route: ActivatedRoute,
    userInput: any,
  ): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) =>
        (this.apiService as EmpVariationReviewApiService).saveVariationDetailsReviewDecision(payload as any),
      ),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }

  saveReviewDetermination(subtask: string, step: string, route: ActivatedRoute, userInput: any): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) => (this.apiService as EmpVariationReviewApiService).saveReviewDetermination(payload)),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }

  sendForAmends(): Observable<EmpVariationApplicationReviewRequestTaskPayload> {
    return (this.apiService as EmpVariationReviewApiService).sendForAmends(this.payload);
  }
}
