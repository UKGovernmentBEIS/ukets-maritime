import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerDerogations } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { aerEmissionsShipMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-derogations-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    BooleanToTextPipe,
  ],
  standalone: true,
  templateUrl: './aer-derogations-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerDerogationsSummaryTemplateComponent {
  readonly data = input<AerDerogations>();
  readonly isEditable = input<boolean>(false);
  readonly changeLink = input<string>();
  readonly queryParams = input<Params>({});
  readonly map = aerEmissionsShipMap;
}
