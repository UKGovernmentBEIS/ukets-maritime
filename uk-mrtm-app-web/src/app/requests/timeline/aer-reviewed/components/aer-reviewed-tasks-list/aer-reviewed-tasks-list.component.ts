import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { TaskSuperListComponent } from '@netz/common/components';
import { TaskSuperSection } from '@netz/common/model';
import { RequestActionStore } from '@netz/common/store';

import {
  getAerSubmittedSubtaskSections,
  getAerVerificationAssessmentsAndFindingsSections,
} from '@requests/common/aer/helpers';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AER_REVIEWED_ROUTE_PREFIX } from '@requests/timeline/aer-reviewed';

@Component({
  selector: 'mrtm-aer-reviewed-tasks-list',
  standalone: true,
  imports: [TaskSuperListComponent],
  templateUrl: './aer-reviewed-tasks-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerReviewedTasksListComponent {
  private readonly store = inject(RequestActionStore);
  private readonly aer = this.store.select(aerTimelineCommonQuery.selectAer);
  private readonly assessmentsAndFindingsSections =
    getAerVerificationAssessmentsAndFindingsSections(AER_REVIEWED_ROUTE_PREFIX);

  readonly superSections: Signal<TaskSuperSection[]> = computed(() => {
    return [
      {
        superTitle: 'Verifier’s assessments and findings',
        sections: this.assessmentsAndFindingsSections,
      },
      {
        superTitle: 'Operator’s application',
        sections: [...getAerSubmittedSubtaskSections(`${AER_REVIEWED_ROUTE_PREFIX}`, this.aer(), false)],
      },
    ];
  });
}
