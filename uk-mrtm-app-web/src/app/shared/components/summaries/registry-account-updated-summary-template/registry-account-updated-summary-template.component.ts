import { ChangeDetectionStrategy, Component, computed, input, InputSignal, Signal } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { RegistryOrganisationStructureSummaryTemplateComponent } from '@shared/components/summaries/registry-organisation-structure-summary-template';
import { CompetentAuthorityPipe } from '@shared/pipes';
import { RegistryAccountUpdateDto } from '@shared/types';

@Component({
  selector: 'mrtm-registry-account-updated-summary-template',
  imports: [
    RegistryOrganisationStructureSummaryTemplateComponent,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    CompetentAuthorityPipe,
  ],
  standalone: true,
  templateUrl: './registry-account-updated-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryAccountUpdatedSummaryTemplateComponent {
  readonly data: InputSignal<RegistryAccountUpdateDto> = input<RegistryAccountUpdateDto>();
  readonly account: Signal<RegistryAccountUpdateDto['accountDetails']> = computed(() => this.data()?.accountDetails);
  readonly organisationStructure: Signal<RegistryAccountUpdateDto['organisationStructure']> = computed(
    () => this.data()?.organisationStructure,
  );
}
