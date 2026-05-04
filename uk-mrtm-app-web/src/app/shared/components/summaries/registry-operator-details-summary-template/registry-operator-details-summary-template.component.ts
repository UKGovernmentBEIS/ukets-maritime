import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { EmpOperatorDetails, MrtmAccountViewDTO } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { RegistryOrganisationStructureSummaryTemplateComponent } from '@shared/components/summaries/registry-organisation-structure-summary-template/registry-organisation-structure-summary-template.component';
import { CompetentAuthorityPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-registry-operator-details-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    GovukDatePipe,
    CompetentAuthorityPipe,
    RegistryOrganisationStructureSummaryTemplateComponent,
  ],
  standalone: true,
  templateUrl: './registry-operator-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryOperatorDetailsSummaryTemplateComponent {
  readonly operatorDetails = input.required<EmpOperatorDetails>();
  readonly account = input.required<MrtmAccountViewDTO>();
}
