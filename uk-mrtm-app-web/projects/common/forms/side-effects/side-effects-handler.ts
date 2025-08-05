import { inject, Injectable } from '@angular/core';

import { concatMap, Observable, of } from 'rxjs';

import { RequestTaskPayload } from '@mrtm/api';

import { SideEffect, SubtaskOperation } from './side-effect';
import { SIDE_EFFECTS } from './side-effects.providers';

@Injectable()
export class SideEffectsHandler {
  private sideEffects: SideEffect[] = inject(SIDE_EFFECTS, { optional: true });

  apply<T extends RequestTaskPayload>(
    subtask: string,
    step: string,
    payload: T,
    operation: SubtaskOperation,
  ): Observable<T> {
    const sideEffectsToApply = (this.sideEffects ?? []).filter(
      (se) =>
        se.subtask === subtask &&
        se.on.includes(operation) &&
        (step === null ? !se.step : !se.step || se.step === step),
    );

    if (!sideEffectsToApply || sideEffectsToApply.length === 0) {
      return of(payload);
    } else {
      return sideEffectsToApply.reduce(
        (acc$: Observable<T>, sideEffect) => acc$.pipe(concatMap((currentPayload) => sideEffect.apply(currentPayload))),
        of(payload),
      );
    }
  }
}
