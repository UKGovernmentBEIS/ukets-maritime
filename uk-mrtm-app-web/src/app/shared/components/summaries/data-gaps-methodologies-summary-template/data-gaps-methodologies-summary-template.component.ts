import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerDataGapsMethodologies } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { DataGapsMethodologiesStep } from '@requests/common/aer/subtasks/data-gaps-methodologies/data-gaps-methodologies.helpers';
import { dataGapsMethodologiesMap } from '@requests/common/aer/subtasks/data-gaps-methodologies/data-gaps-methodologies-subtask-list.map';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-data-gaps-methodologies-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    NotProvidedDirective,
    RouterLink,
    BooleanToTextPipe,
  ],
  templateUrl: './data-gaps-methodologies-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataGapsMethodologiesSummaryTemplateComponent {
  readonly data = input.required<AerDataGapsMethodologies>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = DataGapsMethodologiesStep;
  readonly map = dataGapsMethodologiesMap;
}
