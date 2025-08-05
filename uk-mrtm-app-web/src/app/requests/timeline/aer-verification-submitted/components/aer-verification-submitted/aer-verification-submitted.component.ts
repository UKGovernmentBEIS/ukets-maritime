import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';

import { TaskSuperListComponent } from '@netz/common/components';
import { TaskSuperSection } from '@netz/common/model';
import { RequestActionStore } from '@netz/common/store';

import {
  getAerSubmittedSubtaskSections,
  getAerVerificationAssessmentsAndFindingsSections,
} from '@requests/common/aer/helpers';
import { aerTimelineCommonQuery } from '@requests/common/timeline/aer-common';
import { AER_VERIFICATION_SUBMITTED_ROUTE_PREFIX } from '@requests/timeline/aer-verification-submitted/aer-verification-submitted.routes';

@Component({
  selector: 'mrtm-aer-verification-submitted',
  standalone: true,
  imports: [TaskSuperListComponent],
  templateUrl: './aer-verification-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerVerificationSubmittedComponent {
  private readonly store = inject(RequestActionStore);
  private readonly aer = this.store.select(aerTimelineCommonQuery.selectAer);
  private readonly assessmentsAndFindingsSections = getAerVerificationAssessmentsAndFindingsSections(
    AER_VERIFICATION_SUBMITTED_ROUTE_PREFIX,
  );

  readonly superSections: Signal<TaskSuperSection[]> = computed(() => {
    return [
      {
        superTitle: 'Verifier’s assessments and findings',
        sections: this.assessmentsAndFindingsSections,
      },
      {
        superTitle: 'Operator’s application',
        sections: [...getAerSubmittedSubtaskSections(AER_VERIFICATION_SUBMITTED_ROUTE_PREFIX, this.aer(), false)],
      },
    ];
  });
}
