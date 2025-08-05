import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MrtmItemDTO } from '@mrtm/api';

import { DaysRemainingPipe, ItemLinkPipe, ItemNamePipe, UserFullNamePipe } from '@netz/common/pipes';
import { getYearFromRequestId } from '@netz/common/utils';
import { GovukTableColumn, LinkDirective, TableComponent, TagComponent } from '@netz/govuk-components';

import { ItemTypePipe } from '@shared/dashboard/pipes/item-type.pipe';

@Component({
  selector: 'mrtm-dashboard-items-list',
  templateUrl: './dashboard-items-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TableComponent,
    LinkDirective,
    RouterLink,
    TagComponent,
    ItemLinkPipe,
    ItemNamePipe,
    UserFullNamePipe,
    ItemTypePipe,
    DaysRemainingPipe,
  ],
})
export class DashboardItemsListComponent {
  @Input() items: MrtmItemDTO[];
  @Input() tableColumns: GovukTableColumn<MrtmItemDTO>[];
  @Input() unassignedLabel: string;

  readonly getYearFromRequestId = getYearFromRequestId;
}
