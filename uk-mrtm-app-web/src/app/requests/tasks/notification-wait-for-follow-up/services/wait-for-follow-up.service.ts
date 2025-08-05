import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery } from '@netz/common/store';

import { waitForFollowUpQuery } from '@requests/tasks/notification-wait-for-follow-up/+state';
import { WaitForFollowUpApiService } from '@requests/tasks/notification-wait-for-follow-up/services/wait-for-follow-up.api.service';
import { WaitForFollowUpTaskPayload } from '@requests/tasks/notification-wait-for-follow-up/wait-for-follow-up.types';

@Injectable()
export class WaitForFollowUpService extends TaskService<WaitForFollowUpTaskPayload> {
  get payload(): WaitForFollowUpTaskPayload {
    return this.store.select(waitForFollowUpQuery.selectPayload)();
  }

  set payload(payload: WaitForFollowUpTaskPayload) {
    this.store.setPayload(payload);
  }

  saveWaitForFollowUp(subtask: string, step: string, route: ActivatedRoute, userInput: Date) {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      switchMap((payload) => (this.apiService as WaitForFollowUpApiService).save(payload)),
      tap((payload) => this.store.setPayload(payload)),
      switchMap(() =>
        (this.apiService as WaitForFollowUpApiService).updateTimeline(
          this.store.select(requestTaskQuery.selectRequestId)(),
        ),
      ),
      tap((timeline) => this.store.setTimeline(timeline)),
      switchMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }
}
