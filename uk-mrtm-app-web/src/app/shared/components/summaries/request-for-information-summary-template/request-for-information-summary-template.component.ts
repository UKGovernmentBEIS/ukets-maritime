import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

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
import { AttachedFile, RfiSubmitDto } from '@shared/types';

@Component({
  selector: 'mrtm-request-for-information-summary-template',
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
  templateUrl: './request-for-information-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationSummaryTemplateComponent {
  readonly data = input.required<RfiSubmitDto>();
  readonly isEditable = input<boolean>();
  readonly questionEditUrl = input<string>();
  readonly notificationEditUrl = input<string>();
  readonly queryParams = input<Params>();
  /** The download link of the official notice preview, displayed under the recipients. */
  readonly officialNotice = input<AttachedFile>();
}
