import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { catchError, map, of, switchMap } from 'rxjs';

import { RequestFeedbackAPIService } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';
import { LinkDirective } from '@netz/govuk-components';

import {
  REQUEST_FEEDBACK_CONFIG,
  REQUEST_FEEDBACK_TASK_TYPES,
  RequestFeedbackType,
} from '@feedback/request-feedback/request-feedback.config';
import { ServiceFeedbackLinkService } from '@shared/services';

@Component({
  selector: 'mrtm-request-feedback-invitation',
  imports: [LinkDirective, RouterLink],
  standalone: true,
  templateUrl: './request-feedback-invitation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestFeedbackInvitationComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly requestFeedbackService = inject(RequestFeedbackAPIService);
  private readonly serviceFeedbackLinkService = inject(ServiceFeedbackLinkService);
  private readonly destroyRef = inject(DestroyRef);

  readonly type = input.required<RequestFeedbackType>();

  readonly requestId = this.store.select(requestTaskQuery.selectRequestId);
  private readonly taskType = this.store.select(requestTaskQuery.selectRequestTaskType);
  readonly config = computed(() => REQUEST_FEEDBACK_CONFIG[this.type()]);

  private readonly feedbackQuery = computed(() =>
    this.requestId() && this.taskType() === REQUEST_FEEDBACK_TASK_TYPES[this.type()]
      ? { requestId: this.requestId(), type: this.type() }
      : null,
  );

  readonly isFeedbackAvailable = toSignal(
    toObservable(this.feedbackQuery).pipe(
      switchMap((query) =>
        query
          ? this.requestFeedbackService.getRequestFeedbackDetails(query.requestId, query.type).pipe(
              map((details) => details?.status === 'NEW' && !details?.expired),
              catchError(() => of(false)),
            )
          : of(false),
      ),
    ),
    { initialValue: false },
  );

  private isServiceFeedbackLinkHidden = false;

  constructor() {
    effect(() => {
      if (this.isFeedbackAvailable() && !this.isServiceFeedbackLinkHidden) {
        this.isServiceFeedbackLinkHidden = true;
        untracked(() => this.serviceFeedbackLinkService.hideUntilDestroyed(this.destroyRef));
      }
    });
  }
}
