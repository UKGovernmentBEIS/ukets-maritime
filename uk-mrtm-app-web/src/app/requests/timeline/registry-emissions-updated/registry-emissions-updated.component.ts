import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RegistryUpdatedEmissionsEventSubmittedRequestActionPayload } from '@mrtm/api';

import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { RegistryEmissionsUpdatedSummaryTemplateComponent } from '@shared/components';

@Component({
  selector: 'mrtm-registry-emissions-updated',
  standalone: true,
  imports: [RegistryEmissionsUpdatedSummaryTemplateComponent],
  template: `
    <mrtm-registry-emissions-updated-summary-template [data]="registryUpdatedEmissionsData" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryEmissionsUpdatedComponent {
  private readonly store = inject(RequestActionStore);
  registryUpdatedEmissionsData: RegistryUpdatedEmissionsEventSubmittedRequestActionPayload = this.store.select(
    requestActionQuery.selectActionPayload,
  )() as RegistryUpdatedEmissionsEventSubmittedRequestActionPayload;
}
