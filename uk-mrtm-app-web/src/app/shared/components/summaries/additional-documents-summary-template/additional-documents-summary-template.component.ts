import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  standalone: true,
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
  templateUrl: './additional-documents-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdditionalDocumentsSummaryTemplateComponent {
  @Input({ required: true }) additionalDocuments: AdditionalDocuments;
  @Input() originalAdditionalDocuments: AdditionalDocuments;
  @Input({ required: true }) additionalDocumentsMap: SubTaskListMap<{ additionalDocumentsUpload: string }>;
  @Input({ required: true }) files: AttachedFile[];
  @Input() originalFiles: AttachedFile[];
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
