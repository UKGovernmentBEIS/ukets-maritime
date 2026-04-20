import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { AerRecommendedImprovements } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { RecommendedImprovementsStep } from '@requests/common/aer/subtasks/recommended-improvements/recommended-improvements.helpers';
import { recommendedImprovementsMap } from '@requests/common/aer/subtasks/recommended-improvements/recommended-improvements-subtask-list.map';
import { RecommendedImprovementsListTemplateComponent } from '@shared/components/summaries/recommended-improvements-list-template';
import { NotProvidedDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-recommended-improvements-summary-template',
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
    RecommendedImprovementsListTemplateComponent,
  ],
  templateUrl: './recommended-improvements-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecommendedImprovementsSummaryTemplateComponent {
  readonly data = input.required<AerRecommendedImprovements>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({ change: true });

  readonly wizardStep = RecommendedImprovementsStep;
  readonly map = recommendedImprovementsMap;
}
