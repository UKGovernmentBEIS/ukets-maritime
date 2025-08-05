import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmpOperatorDetails, MrtmAccountViewDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  CompetentAuthorityPipe,
  CountryPipe,
  LegalStatusTypeDisplayTextPipe,
  OrganisationDetailsAddressTitlePipe,
} from '@shared/pipes';

@Component({
  selector: 'mrtm-registry-operator-details-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LegalStatusTypeDisplayTextPipe,
    CountryPipe,
    OrganisationDetailsAddressTitlePipe,
    GovukDatePipe,
    CompetentAuthorityPipe,
  ],
  templateUrl: './registry-operator-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryOperatorDetailsSummaryTemplateComponent {
  operatorDetails = input.required<EmpOperatorDetails>();
  account = input.required<MrtmAccountViewDTO>();
}
