import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload } from '@mrtm/api';

import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RegistrySubmittedSummaryTemplateComponent } from '@shared/components/summaries/registry-submitted-summary-template/registry-submitted-summary-template.component';

@Component({
  selector: 'mrtm-registry-submitted',
  standalone: true,
  imports: [RegistrySubmittedSummaryTemplateComponent],
  templateUrl: './registry-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrySubmittedComponent {
  private readonly store = inject(RequestActionStore);
  registrySubmittedData: EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload = this.store.select(
    requestActionQuery.selectActionPayload,
  )() as EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload;
}
