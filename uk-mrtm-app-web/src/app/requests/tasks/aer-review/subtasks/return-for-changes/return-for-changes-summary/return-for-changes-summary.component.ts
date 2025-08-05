import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ButtonDirective } from '@netz/govuk-components';

import { AER_REVIEW_SUBTASK_TO_TITLE_MAP } from '@requests/common/aer/common';
import { aerReviewQuery } from '@requests/tasks/aer-review/+state';
import { AerReviewService } from '@requests/tasks/aer-review/services';
import { EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-operator-amends',
  standalone: true,
  imports: [
    PageHeadingComponent,
    EmpReviewReturnForAmendsSubtaskSummaryTemplateComponent,
    ButtonDirective,
    PendingButtonDirective,
    ReturnToTaskOrActionPageComponent,
  ],
  templateUrl: './return-for-changes-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnForChangesSummaryComponent {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TaskService) as AerReviewService;
  private readonly router: Router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  public readonly decisionForAmends = computed(() => this.store.select(aerReviewQuery.selectDecisionNeededAmends)());
  public readonly subtaskTitleMap = AER_REVIEW_SUBTASK_TO_TITLE_MAP;

  public onSubmit() {
    this.service.sendForAmends().subscribe(() => {
      this.router.navigate(['success'], { relativeTo: this.activatedRoute });
    });
  }
}
