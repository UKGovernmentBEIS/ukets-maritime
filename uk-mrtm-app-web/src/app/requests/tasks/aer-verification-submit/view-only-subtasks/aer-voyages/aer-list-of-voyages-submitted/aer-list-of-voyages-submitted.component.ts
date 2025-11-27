import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerVoyagesMap } from '@requests/common/aer/subtasks/aer-voyages';
import { aerVerificationSubmitQuery } from '@requests/tasks/aer-verification-submit/+state/aer-verification-submit.selectors';
import { VoyagesListSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-aer-list-of-voyages-submitted',
  standalone: true,
  imports: [VoyagesListSummaryTemplateComponent, ReturnToTaskOrActionPageComponent, PageHeadingComponent],
  templateUrl: './aer-list-of-voyages-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerListOfVoyagesSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly map = aerVoyagesMap;
  readonly voyages = this.store.select(aerVerificationSubmitQuery.selectVoyagesList);
}
