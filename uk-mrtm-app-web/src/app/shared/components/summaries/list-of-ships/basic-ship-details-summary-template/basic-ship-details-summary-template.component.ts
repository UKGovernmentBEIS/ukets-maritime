import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Params, RouterLink } from '@angular/router';

import { isNil } from 'lodash-es';

import { AerShipEmissions, EmpShipEmissions } from '@mrtm/api';

import { GovukDatePipe } from '@netz/common/pipes';
import {
  LinkDirective,
  SummaryListComponent,
  SummaryListRowActionsDirective,
  SummaryListRowDirective,
  SummaryListRowKeyDirective,
  SummaryListRowValueDirective,
} from '@netz/govuk-components';

import {
  EMP_SHIP_REPORTING_RESPONSIBILITY_SELECT_ITEMS,
  SHIP_FLAG_SELECT_ITEMS,
  SHIP_ICE_CLASS_SELECT_ITEMS,
  SHIP_TYPE_SELECT_ITEMS,
} from '@shared/constants';
import { BooleanToTextPipe, SelectOptionToTitlePipe } from '@shared/pipes';

@Component({
  selector: 'mrtm-basic-ship-details-summary-template',
  standalone: true,
  imports: [
    SummaryListComponent,
    SummaryListRowActionsDirective,
    SummaryListRowDirective,
    SummaryListRowKeyDirective,
    SummaryListRowValueDirective,
    LinkDirective,
    RouterLink,
    SelectOptionToTitlePipe,
    GovukDatePipe,
    BooleanToTextPipe,
  ],
  templateUrl: './basic-ship-details-summary-template.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicShipDetailsSummaryTemplateComponent {
  public readonly shipTypeSelectItems = SHIP_TYPE_SELECT_ITEMS;
  public readonly flagStateSelectItems = SHIP_FLAG_SELECT_ITEMS;
  public readonly iceClassSelectItems = SHIP_ICE_CLASS_SELECT_ITEMS;
  public readonly reportingResponsibilitySelectItems = EMP_SHIP_REPORTING_RESPONSIBILITY_SELECT_ITEMS;

  public readonly data = input.required<EmpShipEmissions['details'] | AerShipEmissions['details']>();
  public readonly changeLink = input<string>();
  public readonly isEditable = input<boolean>(false);
  public readonly queryParams = input<Params>({});
  public readonly isAer = input<boolean>(false);
  public readonly isNil = isNil;
}
