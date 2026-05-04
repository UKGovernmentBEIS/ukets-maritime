import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { SummaryDownloadFilesComponent } from '@shared/components';
import { RegistryNoticeEventTypePipe } from '@shared/pipes/registry-notice-event-type.pipe';
import { RegistryNoticeEventSubmittedDto } from '@shared/types';

@Component({
  selector: 'mrtm-registry-notice-event-submitted-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RegistryNoticeEventTypePipe,
    SummaryDownloadFilesComponent,
  ],
  templateUrl: './registry-notice-event-submitted-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistryNoticeEventSubmittedSummaryTemplateComponent {
  readonly data = input<RegistryNoticeEventSubmittedDto>();
}
