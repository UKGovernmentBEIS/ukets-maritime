import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
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
  standalone: true,
  templateUrl: './abbreviations-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AbbreviationsSummaryTemplateComponent {
  readonly abbreviations = input.required<EmpAbbreviations>();
  readonly originalAbbreviations = input<EmpAbbreviations>();
  readonly abbreviationsMap = input.required<
    SubTaskListMap<{
      abbreviationsQuestion: string;
    }>
  >();
  readonly wizardStep = input<{
    [s: string]: string;
  }>();
  readonly isEditable = input(false);
  readonly queryParams = input<Params>({});

  readonly combinedAbbreviationDefinitions = computed(() =>
    mergeDiffArray<EmpAbbreviationDefinition>(
      this.abbreviations()?.abbreviationDefinitions,
      this.originalAbbreviations()?.abbreviationDefinitions,
    ),
  );
}
