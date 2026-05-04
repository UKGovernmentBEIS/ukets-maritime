import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { UncorrectedItem, VerifierComment } from '@mrtm/api';

import {
  SummaryListComponent,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { virSubtaskList } from '@requests/common/vir';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-vir-verifier-recommendation-summary-template',
  imports: [
    SummaryListComponent,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    BooleanToTextPipe,
  ],
  standalone: true,
  templateUrl: './vir-verifier-recommendation-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirVerifierRecommendationSummaryTemplateComponent {
  public readonly data = input<VerifierComment | UncorrectedItem>();
  protected readonly virSubtaskList = virSubtaskList;
}
