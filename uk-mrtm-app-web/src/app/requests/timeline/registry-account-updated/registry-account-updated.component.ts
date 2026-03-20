import { ChangeDetectionStrategy, Component, inject, Signal } from '@angular/core';

import { RequestActionStore } from '@netz/common/store';

import { registryAccountUpdatedQuery } from '@requests/timeline/registry-account-updated/+state';
import { RegistryAccountUpdatedSummaryTemplateComponent } from '@shared/components';
import { RegistryAccountUpdateDto } from '@shared/types';

@Component({
  selector: 'mrtm-registry-account-updated',
  imports: [RegistryAccountUpdatedSummaryTemplateComponent],
  standalone: true,
  template: `
    <mrtm-registry-account-updated-summary-template [data]="data()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryAccountUpdatedComponent {
  private readonly store = inject(RequestActionStore);

  readonly data: Signal<RegistryAccountUpdateDto> = this.store.select(
    registryAccountUpdatedQuery.selectRegistryAccountUpdated,
  );
}
