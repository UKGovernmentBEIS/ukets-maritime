import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

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
import { FollowUpResponse } from '@shared/types/follow-up-response.interface';

@Component({
  selector: 'mrtm-follow-up-response-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    SummaryListRowActionsDirective,
    SummaryDownloadFilesComponent,
    NotProvidedDirective,
  ],
  templateUrl: './follow-up-response-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowUpResponseSummaryTemplateComponent {
  @Input({ required: true }) followUpResponse: FollowUpResponse;
  @Input() changeLink: string;
  @Input() isEditable = false;
  @Input() queryParams: Params = {};
}
