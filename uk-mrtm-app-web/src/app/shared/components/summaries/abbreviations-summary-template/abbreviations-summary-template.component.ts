import { ChangeDetectionStrategy, Component, computed, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { EmpAbbreviationDefinition, EmpAbbreviations } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { HtmlDiffDirective } from '@shared/directives';
import { BooleanToTextPipe } from '@shared/pipes';
import { SubTaskListMap } from '@shared/types';
import { mergeDiffArray } from '@shared/utils';

@Component({
  selector: 'mrtm-abbreviations-summary-template',
  standalone: true,
  imports: [
    BooleanToTextPipe,
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    HtmlDiffDirective,
  ],
  templateUrl: './abbreviations-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbbreviationsSummaryTemplateComponent {
  @Input({ required: true }) abbreviations: EmpAbbreviations;
  @Input() originalAbbreviations: EmpAbbreviations;
  @Input({ required: true }) abbreviationsMap: SubTaskListMap<{ abbreviationsQuestion: string }>;
  @Input() wizardStep: { [s: string]: string };
  @Input() isEditable = false;
  @Input() queryParams: Params = {};

  combinedAbbreviationDefinitions = computed(() =>
    mergeDiffArray<EmpAbbreviationDefinition>(
      this.abbreviations?.abbreviationDefinitions,
      this.originalAbbreviations?.abbreviationDefinitions,
    ),
  );
}
