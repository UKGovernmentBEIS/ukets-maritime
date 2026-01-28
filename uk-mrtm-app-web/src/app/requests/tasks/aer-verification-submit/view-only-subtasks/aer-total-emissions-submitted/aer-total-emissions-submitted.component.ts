import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerTotalEmissionsMap } from '@requests/common/aer';
import { aerCommonQuery } from '@requests/common/aer/+state';
import { AerTotalEmissionsSummaryTemplateComponent } from '@shared/components/summaries';

@Component({
  selector: 'mrtm-aer-total-emissions-submitted',
  standalone: true,
  imports: [ReturnToTaskOrActionPageComponent, PageHeadingComponent, AerTotalEmissionsSummaryTemplateComponent],
  templateUrl: './aer-total-emissions-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerTotalEmissionsSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly totalEmissions = this.store.select(aerCommonQuery.selectTotalEmissions);
  readonly aerTotalEmissionsMap = aerTotalEmissionsMap;
}
