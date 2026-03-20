import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AdditionalDocuments } from '@mrtm/api';

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
import { BooleanToTextPipe } from '@shared/pipes';
import { AttachedFile, SubTaskListMap } from '@shared/types';

@Component({
  selector: 'mrtm-additional-documents-summary-template',
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    SummaryDownloadFilesComponent,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    HtmlDiffDirective,
  ],
  standalone: true,
  templateUrl: './additional-documents-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsSummaryTemplateComponent {
  readonly additionalDocuments = input.required<AdditionalDocuments>();
  readonly originalAdditionalDocuments = input<AdditionalDocuments>();
  readonly additionalDocumentsMap = input.required<
    SubTaskListMap<{
      additionalDocumentsUpload: string;
    }>
  >();
  readonly files = input.required<AttachedFile[]>();
  readonly originalFiles = input<AttachedFile[]>();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});
}
