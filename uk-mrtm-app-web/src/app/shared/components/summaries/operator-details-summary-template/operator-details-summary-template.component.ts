import { LowerCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
import {
  CountryPipe,
  LegalStatusTypeDisplayTextPipe,
  OrganisationDetailsAddressTitlePipe,
  OrganisationStructureTitlePipe,
} from '@shared/pipes';
import { AttachedFile } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-operator-details-summary-template',
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
    OrganisationStructureTitlePipe,
    LowerCasePipe,
  ],
  standalone: true,
  templateUrl: './operator-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OperatorDetailsSummaryTemplateComponent {
  readonly operatorDetails = input.required<EmpOperatorDetails | AerOperatorDetails>();
  readonly originalOperatorDetails = input<EmpOperatorDetails | AerOperatorDetails>();
  readonly files = input.required<AttachedFile[]>();
  readonly originalFiles = input<AttachedFile[]>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});

  readonly combinedPartners = computed(() =>
    mergeDiffArray<string>(
      (this.operatorDetails()?.organisationStructure as PartnershipOrganisation)?.partners,
      (this.originalOperatorDetails()?.organisationStructure as PartnershipOrganisation)?.partners,
    ),
  );
}
