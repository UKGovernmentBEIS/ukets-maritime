import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { LimitedCompanyOrganisation } from '@mrtm/api';

import { PageHeadingComponent, ReturnToTaskOrActionPageComponent } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { aerCommonQuery } from '@requests/common/aer/+state';
import { operatorDetailsMap } from '@requests/common/components/operator-details';
import { OperatorDetailsSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-operator-details-submitted',
  imports: [PageHeadingComponent, OperatorDetailsSummaryTemplateComponent, ReturnToTaskOrActionPageComponent],
  standalone: true,
  templateUrl: './operator-details-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSubmittedComponent {
  private readonly store = inject(RequestTaskStore);
  readonly operatorDetails = this.store.select(aerCommonQuery.selectAerOperatorDetails);
  readonly operatorDetailsMap = operatorDetailsMap;
  readonly files = computed(() =>
    this.store.select(
      aerCommonQuery.selectAttachedFiles(
        (this.operatorDetails()?.organisationStructure as LimitedCompanyOrganisation)?.evidenceFiles,
      ),
    )(),
  );
}
