import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { TaskSuperListComponent } from '@netz/common/components';
import { TaskSuperSection } from '@netz/common/model';
import { RequestActionStore } from '@netz/common/store';

import {
  getAerSubmittedSubtaskSections,
  getAerVerificationAssessmentsAndFindingsSections,
} from '@requests/common/aer/helpers';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AER_REVIEW_SKIPPED_ROUTE_PREFIX } from '@requests/timeline/aer-review-skipped/aer-review-skipped.routes';

@Component({
  selector: 'mrtm-aer-review-skipped',
  imports: [TaskSuperListComponent],
  standalone: true,
  templateUrl: './aer-review-skipped.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerReviewSkippedComponent {
  private readonly store = inject(RequestActionStore);
  private readonly aer = this.store.select(aerTimelineCommonQuery.selectAer);
  private readonly assessmentsAndFindingsSections = getAerVerificationAssessmentsAndFindingsSections(
    AER_REVIEW_SKIPPED_ROUTE_PREFIX,
    undefined,
    this.aer(),
  );

  readonly superSections: Signal<TaskSuperSection[]> = computed(() => {
    return [
      {
        superTitle: 'Verifier’s assessments and findings',
        sections: this.assessmentsAndFindingsSections,
      },
      {
        superTitle: 'Operator’s application',
        sections: [...getAerSubmittedSubtaskSections(AER_REVIEW_SKIPPED_ROUTE_PREFIX, this.aer(), false)],
      },
    ];
  });
}
