import { inject, Injectable } from '@angular/core';

import { concatMap, Observable, of } from 'rxjs';

import { RequestTaskPayload } from '@mrtm/api';

import { PayloadMutator } from './payload-mutator';
import { PAYLOAD_MUTATORS } from './payload-mutators.providers';

@Injectable()
export class PayloadMutatorsHandler {
  private payloadMutators: PayloadMutator[] = inject(PAYLOAD_MUTATORS, { optional: false });

  mutate<T extends RequestTaskPayload>(
    subtask: string,
    step: string | null,
    payload: T,
    userInput: any,
  ): Observable<T> {
    const payloadMutatorsToRun = this.payloadMutators.filter(
      (pm) => pm.subtask === subtask && (step === null ? !pm.step : !pm.step || pm.step === step),
    );

    if (!payloadMutatorsToRun || payloadMutatorsToRun.length === 0) {
      return of(payload);
    } else {
      return payloadMutatorsToRun.reduce(
        (acc$: Observable<T>, mutator) =>
          acc$.pipe(concatMap((currentPayload) => mutator.apply(currentPayload, userInput))),
        of(payload),
      );
    }
  }
}
