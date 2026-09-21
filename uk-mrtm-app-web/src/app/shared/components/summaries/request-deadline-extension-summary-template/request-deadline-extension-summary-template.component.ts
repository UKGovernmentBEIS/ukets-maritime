import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { RdePayload } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { NotProvidedDirective } from '@shared/directives';
import { AttachedFile } from '@shared/types';

@Component({
  selector: 'mrtm-request-deadline-extension-summary-template',
  imports: [
    LinkDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    SummaryListRowActionsDirective,
    RouterLink,
    SummaryListComponent,
    GovukDatePipe,
    SummaryDownloadFilesComponent,
  ],
  standalone: true,
  templateUrl: './request-deadline-extension-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestDeadlineExtensionSummaryTemplateComponent {
  readonly data = input.required<RdePayload>();
  readonly isEditable = input<boolean>();
  readonly deadlineFormEditUrl = input<string>();
  readonly deadlineNotificationEditUrl = input<string>();
  readonly queryParams = input<Params>();
  /** The download link of the official notice preview, displayed under the recipients. */
  readonly officialNotice = input<AttachedFile>();
}
