import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';

import { OrganisationStructure } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { CountryPipe, LegalStatusTypeDisplayTextPipe, OrganisationDetailsAddressTitlePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-registry-organisation-structure-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LegalStatusTypeDisplayTextPipe,
    CountryPipe,
    OrganisationDetailsAddressTitlePipe,
  ],
  standalone: true,
  templateUrl: './registry-organisation-structure-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryOrganisationStructureSummaryTemplateComponent {
  readonly data: InputSignal<OrganisationStructure> = input<OrganisationStructure>();
}
