import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { UncertaintyLevel } from '@mrtm/api';

import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import { METHOD_APPROACH_SELECT_OPTIONS, monitoringMethodMap } from '@shared/constants';
import { HtmlDiffDirective } from '@shared/directives';
import { SelectOptionToTitlePipe, UncertaintyLevelValuePipe } from '@shared/pipes';
import { isNil, mergeDiffUncertaintyLevels } from '@shared/utils';

@Component({
  selector: 'mrtm-uncertainty-level-summary-template',
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    SelectOptionToTitlePipe,
    HtmlDiffDirective,
    UncertaintyLevelValuePipe,
  ],
  standalone: true,
  templateUrl: './uncertainty-level-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncertaintyLevelSummaryTemplateComponent {
  readonly uncertaintyLevels = input.required<UncertaintyLevel[]>();
  readonly originalUncertaintyLevels = input<UncertaintyLevel[]>();
  readonly changeLink = input<string>();
  readonly isEditable = input<boolean>(false);
  readonly queryParams = input<Params>({});

  readonly combinedUncertaintyLevels = computed(() =>
    mergeDiffUncertaintyLevels(this.uncertaintyLevels(), this.originalUncertaintyLevels(), this.monitoringMethodMap),
  );

  readonly monitoringMethodMap = monitoringMethodMap;
  readonly methodApproachSelectOptions = METHOD_APPROACH_SELECT_OPTIONS;
  readonly isNil = isNil;
}
