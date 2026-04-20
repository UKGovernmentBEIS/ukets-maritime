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
import { RfiSubmitDto } from '@shared/types';

@Component({
  selector: 'mrtm-request-for-information-summary-template',
  standalone: true,
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
  templateUrl: './request-for-information-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestForInformationSummaryTemplateComponent {
  data = input.required<RfiSubmitDto>();
  isEditable = input<boolean>();
  questionEditUrl = input<string>();
  notificationEditUrl = input<string>();
  queryParams = input<Params>();
}
