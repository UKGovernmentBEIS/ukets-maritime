import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { followUpReviewQuery } from '@requests/tasks/notification-follow-up-review/+state';
import { FollowUpReviewTaskPayload } from '@requests/tasks/notification-follow-up-review/follow-up-review.types';
import { FollowUpReviewDecisionSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-return-for-amends-confirm',
  imports: [
    PageHeadingComponent,
    FollowUpReviewDecisionSummaryTemplateComponent,
    PendingButtonDirective,
    ButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  standalone: true,
  template: `
    <netz-page-heading>Return for amends</netz-page-heading>
    <p class="govuk-body">Check your information before sending</p>
    <mrtm-follow-up-review-decision-summary-template [followUpReviewDecision]="followUpReviewDecisionDTO" />
    <button netzPendingButton govukButton type="button" (click)="onSubmit()">Confirm and return</button>
    <div>
      <hr class="govuk-section-break govuk-section-break--m govuk-section-break--visible" aria-hidden="true" />
      <netz-return-to-task-or-action-page />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnForAmendsConfirmComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly service: TaskService<FollowUpReviewTaskPayload> = inject(TaskService<FollowUpReviewTaskPayload>);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  followUpReviewDecisionDTO = this.store.select(followUpReviewQuery.selectFollowUpReviewDecisionDTO)();

  onSubmit() {
    this.service.submit().subscribe(() => {
      this.router.navigate(['success'], {
        relativeTo: this.route,
        skipLocationChange: true,
      });
    });
  }
}
