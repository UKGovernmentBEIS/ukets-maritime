import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { TaskSuperListComponent } from '@netz/common/components';
import { TaskSuperSection } from '@netz/common/model';
import { RequestTaskStore } from '@netz/common/store';

import { TaskItemStatus } from '@requests/common';
import { aerCommonQuery } from '@requests/common/aer/+state';
import {
  getAerSubmittedSubtaskSections,
  getAerVerificationAssessmentsAndFindingsSections,
} from '@requests/common/aer/helpers';
import {
  AER_REVIEW_OPERATOR_SIDE_ROUTE_PREFIX,
  AER_REVIEW_ROUTE_PREFIX,
  AER_REVIEW_VERIFIER_SIDE_ROUTE_PREFIX,
} from '@requests/tasks/aer-review/aer-review.constants';

@Component({
  selector: 'mrtm-aer-review-subtasks-list',
  standalone: true,
  imports: [TaskSuperListComponent],
  template: '<netz-task-superlist [superSections]="superSections()"/>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerReviewSubtasksListComponent {
  private readonly store: RequestTaskStore = inject(RequestTaskStore);
  private readonly aer = this.store.select(aerCommonQuery.selectAer);
  private readonly sectionsCompleted = this.store.select(aerCommonQuery.selectAerSectionsCompleted);

  readonly superSections: Signal<Array<TaskSuperSection>> = computed(() => {
    const sectionsCompleted = this.sectionsCompleted();
    const aer = this.aer();

    return [
      {
        superTitle: 'Review verifier’s assessments and findings',
        sections: getAerVerificationAssessmentsAndFindingsSections(
          `${AER_REVIEW_ROUTE_PREFIX}/${AER_REVIEW_VERIFIER_SIDE_ROUTE_PREFIX}`,
          sectionsCompleted,
          aer,
          TaskItemStatus.UNDECIDED,
        ),
      },
      {
        superTitle: 'Review operator’s application',
        sections: [
          ...getAerSubmittedSubtaskSections(
            `${AER_REVIEW_ROUTE_PREFIX}/${AER_REVIEW_OPERATOR_SIDE_ROUTE_PREFIX}`,
            this.aer(),
            true,
            sectionsCompleted,
            TaskItemStatus.UNDECIDED,
          ),
        ],
      },
    ];
  });
}
