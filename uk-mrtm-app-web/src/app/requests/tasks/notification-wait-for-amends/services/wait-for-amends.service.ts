import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery } from '@netz/common/store';

import { waitForAmendsQuery } from '@requests/tasks/notification-wait-for-amends/+state';
import { WaitForAmendsApiService } from '@requests/tasks/notification-wait-for-amends/services';
import { WaitForAmendsTaskPayload } from '@requests/tasks/notification-wait-for-amends/wait-for-amends.types';

@Injectable()
export class WaitForAmendsService extends TaskService<WaitForAmendsTaskPayload> {
  get payload(): WaitForAmendsTaskPayload {
    return this.store.select(waitForAmendsQuery.selectPayload)();
  }

  set payload(payload: WaitForAmendsTaskPayload) {
    this.store.setPayload(payload);
  }

  saveWaitForAmends(subtask: string, step: string, route: ActivatedRoute, userInput: Date) {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      switchMap((payload) => (this.apiService as WaitForAmendsApiService).save(payload)),
      tap((payload) => this.store.setPayload(payload)),
      switchMap(() =>
        (this.apiService as WaitForAmendsApiService).updateTimeline(
          this.store.select(requestTaskQuery.selectRequestId)(),
        ),
      ),
      tap((timeline) => this.store.setTimeline(timeline)),
      switchMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }
}
