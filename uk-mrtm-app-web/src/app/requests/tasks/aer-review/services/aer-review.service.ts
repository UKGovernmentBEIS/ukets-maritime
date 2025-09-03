import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AerApplicationReviewRequestTaskPayload, AerSkipReviewDecision } from '@mrtm/api';

import { TaskApiService, TaskService } from '@netz/common/forms';

import { aerReviewQuery } from '@requests/tasks/aer-review/+state';
import { AerReviewTaskPayload } from '@requests/tasks/aer-review/aer-review.types';
import { AerReviewApiService } from '@requests/tasks/aer-review/services/aer-review-api.service';

@Injectable()
export class AerReviewService extends TaskService<AerReviewTaskPayload> {
  override apiService = inject(TaskApiService) as AerReviewApiService;
  get payload(): AerApplicationReviewRequestTaskPayload {
    return this.store.select(aerReviewQuery.selectPayload)();
  }

  set payload(payload: AerApplicationReviewRequestTaskPayload) {
    this.store.setPayload(payload);
  }

  skipReview(payload: AerSkipReviewDecision): Observable<void> {
    return this.apiService.skipReview(payload);
  }

  sendForAmends(): Observable<void> {
    return this.apiService.sendForAmends();
  }
}
