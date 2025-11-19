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

import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-aer-derogations-summary-template',
  standalone: true,
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
  templateUrl: './aer-derogations-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AerDerogationsSummaryTemplateComponent {
  public readonly data = input<AerDerogations>();
  public readonly isEditable = input<boolean>(false);
  public readonly changeLink = input<string>();
  public readonly queryParams = input<Params>({});
}
