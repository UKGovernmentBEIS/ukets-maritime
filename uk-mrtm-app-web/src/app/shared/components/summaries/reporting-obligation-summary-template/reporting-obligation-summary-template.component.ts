import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerReportingObligationDetails } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { BooleanToTextPipe } from '@shared/pipes';
import { AttachedFile, SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-reporting-obligation-summary-template',
  standalone: true,
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    RouterLink,
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    SummaryListRowActionsDirective,
    SummaryDownloadFilesComponent,
  ],
  templateUrl: './reporting-obligation-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportingObligationSummaryTemplateComponent {
  readonly reportingYear = input.required<string>();
  readonly reportingRequired = input.required<boolean>();
  readonly reportingObligationDetails = input.required<AerReportingObligationDetails>();
  readonly files = input.required<AttachedFile[]>();
  readonly map = input.required<
    SubTaskListMap<{
      reportingRequired: string;
      noReportingReason: string;
      supportingDocuments: string;
    }>
  >();

  readonly reportingRequiredLabel = computed(() =>
    this.map().reportingRequired.title.replace('an annual', `a ${this.reportingYear()}`),
  );

  readonly supportingDocumentsLabel = computed(() => this.map().supportingDocuments.title.replace('(optional)', ''));

  readonly isEditable = input<boolean>(false);
  readonly changeLink = input<string>();
  readonly queryParams = input<Params>({ change: true });
}
