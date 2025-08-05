import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { isNil } from 'lodash-es';

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
import { SelectOptionToTitlePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-uncertainty-level-summary-template',
  standalone: true,
  imports: [
    LinkDirective,
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    RouterLink,
    SelectOptionToTitlePipe,
  ],
  templateUrl: './uncertainty-level-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UncertaintyLevelSummaryTemplateComponent {
  public readonly monitoringMethodMap = monitoringMethodMap;
  public readonly methodApproachSelectOptions = METHOD_APPROACH_SELECT_OPTIONS;
  readonly isNil = isNil;

  @Input({ required: true }) data: UncertaintyLevel[];
  @Input() changeLink: string;
  @Input() isEditable: boolean = false;
  @Input() queryParams: Params = {};
}
