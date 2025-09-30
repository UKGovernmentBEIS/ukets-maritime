import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerOperatorDetails, EmpOperatorDetails, PartnershipOrganisation } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { HtmlDiffDirective } from '@shared/directives';
import { CountryPipe, LegalStatusTypeDisplayTextPipe, OrganisationDetailsAddressTitlePipe } from '@shared/pipes';
import { AttachedFile } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-operator-details-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    SummaryListRowActionsDirective,
    LinkDirective,
    SummaryDownloadFilesComponent,
    CountryPipe,
    LegalStatusTypeDisplayTextPipe,
    OrganisationDetailsAddressTitlePipe,
    HtmlDiffDirective,
  ],
  templateUrl: './operator-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSummaryTemplateComponent {
  @Input({ required: true }) operatorDetails: EmpOperatorDetails | AerOperatorDetails;
  @Input() originalOperatorDetails: EmpOperatorDetails | AerOperatorDetails;
  @Input({ required: true }) files: AttachedFile[];
  @Input() originalFiles: AttachedFile[];
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};

  combinedPartners = computed(() =>
    mergeDiffArray<string>(
      (this.operatorDetails?.organisationStructure as PartnershipOrganisation)?.partners,
      (this.originalOperatorDetails?.organisationStructure as PartnershipOrganisation)?.partners,
    ),
  );
}
