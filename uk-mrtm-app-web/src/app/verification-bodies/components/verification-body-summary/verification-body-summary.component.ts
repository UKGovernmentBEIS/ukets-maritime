import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { VerificationBodyCreationDTO, VerificationBodyDTO } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { CountryPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-verification-body-summary',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowActionsDirective,
    SummaryListRowValueDirective,
    RouterLink,
    LinkDirective,
    CountryPipe,
  ],
  templateUrl: './verification-body-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationBodySummaryComponent {
  @Input() summaryInfo: VerificationBodyCreationDTO | VerificationBodyDTO;
  @Input() formRouterLink = 'edit';
  @Input() editable = true;
}
