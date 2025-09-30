import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { switchMap, tap } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { requestTaskQuery } from '@netz/common/store';

import { nonComplianceCommonQuery } from '@requests/common/non-compliance/+state/non-compliance-common.selectors';
import {
  NonComplianceDetailsBase,
  NonComplianceUnionPayload,
} from '@requests/common/non-compliance/non-compliance.types';
import { NonComplianceAmendDetailsApiService } from '@requests/common/non-compliance/non-compliance-amend-details/services/non-compliance-amend-details.api.service';

@Injectable()
export class NonComplianceAmendDetailsService extends TaskService<NonComplianceUnionPayload> {
  get payload(): NonComplianceUnionPayload {
    return this.store.select(nonComplianceCommonQuery.selectPayload)();
  }

  set payload(payload: NonComplianceUnionPayload) {
    this.store.setPayload(payload);
  }

  saveAmendDetails(subtask: string, step: string, route: ActivatedRoute, userInput: NonComplianceDetailsBase) {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      switchMap((payload) => (this.apiService as NonComplianceAmendDetailsApiService).save(payload)),
      tap((payload) => this.store.setPayload(payload)),
      switchMap(() =>
        (this.apiService as NonComplianceAmendDetailsApiService).updateTimeline(
          this.store.select(requestTaskQuery.selectRequestId)(),
        ),
      ),
      tap((timeline) => this.store.setTimeline(timeline)),
      switchMap(() => this.flowManagerForSubtask(subtask).nextStep(step, route)),
    );
  }
}
