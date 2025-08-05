import { ActivatedRoute } from '@angular/router';

import { concatMap, Observable, tap } from 'rxjs';

import { VirSaveRespondToRegulatorCommentsRequestTaskActionPayload } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

import { virRespondToRegulatorCommentsQuery } from '@requests/tasks/vir-respond-to-regulator-comments/+state';
import { VirRespondToRegulatorApiService } from '@requests/tasks/vir-respond-to-regulator-comments/services/vir-respond-to-regulator.api-service';
import { VirRespondToRegulatorCommentsTaskPayload } from '@requests/tasks/vir-respond-to-regulator-comments/vir-respond-to-regulator-comments.types';

export class VirRespondToRegulatorService extends TaskService<VirRespondToRegulatorCommentsTaskPayload> {
  get payload(): VirRespondToRegulatorCommentsTaskPayload {
    return this.store.select(virRespondToRegulatorCommentsQuery.selectPayload)();
  }
  set payload(payload: VirRespondToRegulatorCommentsTaskPayload) {
    this.store.setPayload(payload);
  }

  saveOperatorImprovement(
    subtask: string,
    step: string,
    route: ActivatedRoute,
    reference: VirSaveRespondToRegulatorCommentsRequestTaskActionPayload['reference'],
    userInput: any,
  ): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) =>
        (this.apiService as VirRespondToRegulatorApiService).saveOperatorImprovement(reference, payload),
      ),
      tap((payload) => (this.payload = payload)),
      concatMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }

  submitOperatorImprovement(
    reference: VirSaveRespondToRegulatorCommentsRequestTaskActionPayload['reference'],
  ): Observable<void> {
    return (this.apiService as VirRespondToRegulatorApiService).submitOperatorImprovement(reference);
  }
}
